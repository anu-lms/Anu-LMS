<?php

namespace Drupal\anu_search\Plugin\search_api\processor;

use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Session\AnonymousUserSession;
use Drupal\Core\TypedData\ComplexDataInterface;
use Drupal\eck\EckEntityInterface;
use Drupal\node\NodeInterface;
use Drupal\paragraphs\Entity\Paragraph;
use Drupal\paragraphs\ParagraphInterface;
use Drupal\search_api\Datasource\DatasourceInterface;
use Drupal\search_api\IndexInterface;
use Drupal\search_api\Item\ItemInterface;
use Drupal\search_api\Plugin\search_api\processor\ContentAccess;
use Drupal\search_api\Processor\ProcessorProperty;
use Drupal\search_api\Query\ConditionGroupInterface;
use Drupal\search_api\Query\QueryInterface;
use Drupal\search_api\SearchApiException;
use Drupal\user\Entity\User;

/**
 * Adds content access checks for nodes and comments.
 *
 * @SearchApiProcessor(
 *   id = "anu_content_access",
 *   label = @Translation("ANU Content access"),
 *   description = @Translation("Adds content access checks."),
 *   stages = {
 *     "add_properties" = 0,
 *     "pre_index_save" = -12,
 *     "preprocess_query" = -30,
 *   },
 * )
 */
class AnuAccess extends ContentAccess {

  /**
   * {@inheritdoc}
   */
  public static function supportsIndex(IndexInterface $index) {
    foreach ($index->getDatasources() as $datasource) {
      if (in_array($datasource->getEntityTypeId(), [
        'node',
        'paragraph_comment',
        'paragraph',
        'notebook',
      ])) {
        return TRUE;
      }
    }
    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function getPropertyDefinitions(DatasourceInterface $datasource = NULL) {
    $properties = [];

    if (empty($datasource)) {
      return $properties;
    }

    // Add a field to store node grants against all entity types which are
    // shown within a node: node content (paragraphs) and node comments
    // (paragraph comments).
    $entity_types = ['node', 'paragraph', 'paragraph_comment'];
    if (in_array($datasource->getEntityTypeId(), $entity_types)) {
      $definition = [
        'label' => $this->t('Node access information'),
        'description' => $this->t('Data needed to apply node access.'),
        'type' => 'string',
        'processor_id' => $this->getPluginId(),
        'hidden' => TRUE,
        'is_list' => TRUE,
      ];
      $properties['anu_search_node_grants'] = new ProcessorProperty($definition);
    }

    // Comments within lesson should also get additional fields to store access
    // to the comment. We use show comment to the user if:
    // 1. User has access to the comment's node.
    // 2. User is assigned to comment's organization.
    // 3. Comment is not marked as deleted.
    if ($datasource->getEntityTypeId() == 'paragraph_comment') {
      $definition = [
        'label' => $this->t('Comment access information'),
        'description' => $this->t('Data needed to apply comment access.'),
        'type' => 'string',
        'processor_id' => $this->getPluginId(),
        'hidden' => TRUE,
        'is_list' => TRUE,
      ];
      $properties['anu_search_comment_access'] = new ProcessorProperty($definition);

      $definition = [
        'label' => $this->t('Comment deletion status'),
        'description' => $this->t('Data needed to apply comment access.'),
        'type' => 'boolean',
        'processor_id' => $this->getPluginId(),
        'hidden' => TRUE,
        'is_list' => TRUE,
      ];
      $properties['anu_search_comment_deleted'] = new ProcessorProperty($definition);
    }

    // Add a meta field to the notebook to store access data to the note.
    // The access field stores user uid - only authors should be able to
    // search for their notes.
    if ($datasource->getEntityTypeId() == 'notebook') {
      $definition = [
        'label' => $this->t('Notebook access information'),
        'description' => $this->t('Data needed to apply notebook access.'),
        'type' => 'string',
        'processor_id' => $this->getPluginId(),
        'hidden' => TRUE,
        'is_list' => TRUE,
      ];
      $properties['anu_search_notebook_access'] = new ProcessorProperty($definition);
    }

    return $properties;
  }

  /**
   * {@inheritdoc}
   */
  public function preIndexSave() {
    foreach ($this->index->getDatasources() as $datasource_id => $datasource) {
      $entity_type = $datasource->getEntityTypeId();

      if (in_array($entity_type, ['node', 'paragraph', 'paragraph_comment'])) {
        $this->ensureField($datasource_id, 'anu_search_node_grants', 'string');
        if ($entity_type == 'node') {
          $this->ensureField($datasource_id, 'uid', 'integer');
        }
      }

      if ($entity_type == 'paragraph_comment') {
        $this->ensureField($datasource_id, 'anu_search_comment_access', 'string');
        $this->ensureField($datasource_id, 'anu_search_comment_deleted', 'boolean');
      }

      if ($entity_type == 'notebook') {
        $this->ensureField($datasource_id, 'anu_search_notebook_access', 'string');
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public function addFieldValues(ItemInterface $item) {
    try {

      // Only run for comment items.
      $entity_type_id = $item->getDatasource()->getEntityTypeId();
      $entity = $item->getOriginalObject();
      if (empty($entity)) {
        // Apparently we were active for a wrong item.
        return;
      }

      // Add certain field values to search index to store access information.
      if ($entity_type_id == 'node') {
        $this->addNodeFieldValues($item);
      }
      elseif ($entity_type_id == 'paragraph') {
        $this->addParagraphFieldValues($item);
      }
      elseif ($entity_type_id == 'paragraph_comment') {
        $this->addParagraphCommentFieldValues($item);
      }
      elseif ($entity_type_id == 'notebook') {
        $this->addNotebookFieldValues($item);
      }
    }
    catch (\Exception $exception) {
      $this->logException($exception);
    }
  }

  /**
   * Adds access field values to the node.
   *
   * Was partially copied from Drupal\search_api\Plugin\search_api\processor\ContentAccess::addFieldValues()
   *
   * @param \Drupal\search_api\Item\ItemInterface $item
   *   The item whose field values should be added.
   *
   * @throws \Drupal\search_api\SearchApiException
   */
  protected function addNodeFieldValues(ItemInterface $item) {
    static $anonymous_user;

    if (!isset($anonymous_user)) {
      // Load the anonymous user.
      $anonymous_user = new AnonymousUserSession();
    }

    // Get the node object.
    $node = $this->getNode($item->getOriginalObject());
    if (!$node) {
      // Apparently we were active for a wrong item.
      return;
    }

    $fields = $item->getFields();
    $fields = $this->getFieldsHelper()
      ->filterForPropertyPath($fields, $item->getDatasourceId(), 'anu_search_node_grants');
    foreach ($fields as $field) {
      // Collect grant information for the node.
      if (!$node->access('view', $anonymous_user)) {
        // If anonymous user has no permission we collect all grants with
        // their realms in the item.
        $sql = 'SELECT * FROM {node_access} WHERE (nid = 0 OR nid = :nid) AND grant_view = 1';
        $args = [':nid' => $node->id()];
        foreach ($this->getDatabase()->query($sql, $args) as $grant) {
          $field->addValue("node_access_{$grant->realm}:{$grant->gid}");
        }
      }
      else {
        // Add the generic pseudo view grant if we are not using node access
        // or the node is viewable by anonymous users.
        // @todo: workaround to fix permissions to the nodes that isn't assigned to any group.
        // $field->addValue('node_access__all');.
      }
    }
  }

  /**
   * Adds access field values to the node.
   *
   * Basically access to node's paragraphs should have the same set of permissions as the node itself.
   *
   * @param \Drupal\search_api\Item\ItemInterface $item
   *   The item whose field values should be added.
   *
   * @throws \Drupal\search_api\SearchApiException
   */
  protected function addParagraphFieldValues(ItemInterface $item) {
    $this->addNodeFieldValues($item);
  }

  /**
   * Adds access field values to the comment within lesson's paragraphs.
   *
   * @param \Drupal\search_api\Item\ItemInterface $item
   *   The item whose field values should be added.
   *
   * @throws \Drupal\Core\TypedData\Exception\MissingDataException
   * @throws \Drupal\search_api\SearchApiException
   */
  protected function addParagraphCommentFieldValues(ItemInterface $item) {

    // First add node permissions to the paragraph comment.
    $this->addNodeFieldValues($item);

    // Add information about comment's organization assigned.
    $fields = $item->getFields();
    $fields = $this->getFieldsHelper()
      ->filterForPropertyPath($fields, $item->getDatasourceId(), 'anu_search_comment_access');
    $comment = $item->getOriginalObject();
    foreach ($fields as $field) {
      $org_id = (int) $comment->get('field_comment_organization')->getString();
      $field->addValue('comment_access_org_' . $org_id);
    }

    // Add information about comment's deletion status.
    $fields = $item->getFields();
    $fields = $this->getFieldsHelper()
      ->filterForPropertyPath($fields, $item->getDatasourceId(), 'anu_search_comment_deleted');
    foreach ($fields as $field) {
      $deleted = (boolean) $comment->get('field_comment_deleted')->getString();
      $field->addValue($deleted);
    }
  }

  /**
   * Adds access field values to the notebook notes.
   *
   * @param \Drupal\search_api\Item\ItemInterface $item
   *   The item whose field values should be added.
   *
   * @throws \Drupal\Core\TypedData\Exception\MissingDataException
   * @throws \Drupal\search_api\SearchApiException
   */
  protected function addNotebookFieldValues(ItemInterface $item) {
    $fields = $item->getFields();
    $fields = $this->getFieldsHelper()
      ->filterForPropertyPath($fields, $item->getDatasourceId(), 'anu_search_notebook_access');
    $notebook = $item->getOriginalObject();
    foreach ($fields as $field) {
      $uid = $notebook->get('uid')->getString();
      $field->addValue('notebook_access_uid_' . $uid);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function preprocessSearchQuery(QueryInterface $query) {
    if (!$query->getOption('search_api_bypass_access')) {
      $account = $query->getOption('search_api_access_account', $this->getCurrentUser());
      if (is_numeric($account)) {
        $account = User::load($account);
      }
      if ($account instanceof AccountInterface) {
        try {
          // Add search query for each type of entity added to the search index.
          $this->addNodeAccess($query, $account);
          $this->addParagraphAccess($query, $account);
          $this->addParagraphCommentAccess($query, $account);
          $this->addNotebookAccess($query, $account);

          // VERY good way to debug search query that is being finally built out.
          // $query_stringified = (string) $query;.
        }
        catch (SearchApiException $e) {
          $this->logException($e);
        }
      }
      else {
        $account = $query->getOption('search_api_access_account', $this->getCurrentUser());
        if ($account instanceof AccountInterface) {
          $account = $account->id();
        }
        if (!is_scalar($account)) {
          $account = var_export($account, TRUE);
        }
        $this->getLogger()
          ->warning('An illegal user UID was given for content access: @uid.', ['@uid' => $account]);
      }
    }
  }

  /**
   * Adds access checks to the query for node.
   */
  protected function addNodeAccess(QueryInterface $query, AccountInterface $account) {

    $datasource_id = $this->getDataSourceIdByEntityType('node');
    $node_condition_group = $query->createConditionGroup('AND');

    // Make sure the datasource used is right (entity:node).
    $node_condition_group->addCondition('search_api_datasource', $datasource_id);

    // Make sure the node is published.
    $status_field = $this->findField($datasource_id, 'status', 'boolean');
    if ($status_field) {
      $node_condition_group->addCondition($status_field->getFieldIdentifier(), TRUE);
    }

    // Add node grants for the current user to the query for the node.
    $grants_condition_group = $this->getNodeGrantsCondition($query, $account, 'node');
    $node_condition_group->addConditionGroup($grants_condition_group);

    // Add condition built for nodes to the general query. Just like this:
    // [node conditions set] OR [other conditions].
    $outer_condition_group = $this->getOuterConditionGroup($query);
    $outer_condition_group->addConditionGroup($node_condition_group);
  }

  /**
   * Adds access checks to the query for node paragraphs.
   *
   * TODO: Implement access checks for (un)published associated node.
   */
  protected function addParagraphAccess(QueryInterface $query, AccountInterface $account) {

    $datasource_id = $this->getDataSourceIdByEntityType('paragraph');
    $paragraph_condition_group = $query->createConditionGroup('AND');

    // Make sure the data source is correct (entity:paragraph).
    $paragraph_condition_group->addCondition('search_api_datasource', $datasource_id);

    // Add node grants for the current user to the query for the paragraph.
    $grants_condition_group = $this->getNodeGrantsCondition($query, $account, 'paragraph');
    $paragraph_condition_group->addConditionGroup($grants_condition_group);

    // Add condition built for paragraphs to the general query. Just like this:
    // [paragraph conditions set] OR [other conditions].
    $outer_condition_group = $this->getOuterConditionGroup($query);
    $outer_condition_group->addConditionGroup($paragraph_condition_group);
  }

  /**
   * Adds access checks to the query for node paragraph comments.
   *
   * TODO: Implement access checks for (un)published associated node.
   */
  protected function addParagraphCommentAccess(QueryInterface $query, AccountInterface $account) {

    $datasource_id = $this->getDataSourceIdByEntityType('paragraph_comment');
    $comment_condition_group = $query->createConditionGroup('AND');

    // Make sure the data source is correct (entity:paragraph_comment).
    $comment_condition_group->addCondition('search_api_datasource', $datasource_id);

    // Filter by the user's organization.
    $comment_access_field = $this->findField($datasource_id, 'anu_search_comment_access', 'string');
    if ($comment_access_field) {

      // Get a list of user's organizations assigned.
      $user = User::load($account->id());
      $organizations = $user->get('field_organization')->getValue();

      // Add each user's organization to the query.
      $organizations_group = $query->createConditionGroup('OR');
      $comment_access_field_id = $comment_access_field->getFieldIdentifier();
      foreach ($organizations as $organization) {
        $organization_id = $organization['target_id'];
        $organizations_group->addCondition($comment_access_field_id, 'comment_access_org_' . $organization_id);
      }

      // If user has no orgs assigned to him, we should query only comments
      // which are not assigned to any organization as well.
      if (empty($organizations)) {
        $organizations_group->addCondition($comment_access_field_id, 'comment_access_org_0');
      }

      $comment_condition_group->addConditionGroup($organizations_group);
    }

    // Add node grants for the current user to the query for the  comment.
    $grants_condition_group = $this->getNodeGrantsCondition($query, $account, 'paragraph_comment');
    $comment_condition_group->addConditionGroup($grants_condition_group);

    // Add check that the comment is not deleted.
    $comment_condition_group->addCondition('anu_search_comment_deleted', FALSE);

    // Add condition built for comments to the general query. Just like this:
    // [comment conditions set] OR [other conditions].
    $outer_condition_group = $this->getOuterConditionGroup($query);
    $outer_condition_group->addConditionGroup($comment_condition_group);
  }

  /**
   * Adds access checks to the query for notebook notes.
   */
  protected function addNotebookAccess(QueryInterface $query, AccountInterface $account) {

    $datasource_id = $this->getDataSourceIdByEntityType('notebook');
    $notebook_condition_group = $query->createConditionGroup('AND');

    // Make sure the data source is correct (entity:notebook).
    $notebook_condition_group->addCondition('search_api_datasource', $datasource_id);

    // Add condition to confirm that the notebook's note was created by
    // the current user.
    $notebook_access_field = $this->findField($datasource_id, 'anu_search_notebook_access', 'string');
    $notebook_condition_group->addCondition($notebook_access_field->getFieldIdentifier(), 'notebook_access_uid_' . $account->id());

    // Add condition built for notebook to the general query. Just like this:
    // [notebook conditions set] OR [other conditions].
    $outer_condition_group = $this->getOuterConditionGroup($query);
    $outer_condition_group->addConditionGroup($notebook_condition_group);
  }

  /**
   * Helper function. Adds conditions for all node grants available for the current user.
   */
  private function getNodeGrantsCondition(QueryInterface $query, AccountInterface $account, $entity_type_id) {
    $grants_conditions = $query->createConditionGroup('OR', ['content_access_grants']);
    $datasource_id = $this->getDataSourceIdByEntityType($entity_type_id);

    // Make sure the field exists on the given entity.
    $node_grants_field = $this->findField($datasource_id, 'anu_search_node_grants', 'string');
    if (!$node_grants_field) {
      return $grants_conditions;
    }

    // Add node grants for the current user to the query.
    $node_grants_field_id = $node_grants_field->getFieldIdentifier();
    $grants = node_access_grants('view', $account);
    foreach ($grants as $realm => $gids) {
      foreach ($gids as $gid) {
        $grants_conditions->addCondition($node_grants_field_id, "node_access_$realm:$gid");
      }
    }

    // Also add items that are accessible for everyone by checking the "access
    // all" pseudo grant.
    $grants_conditions->addCondition($node_grants_field_id, 'node_access__all');
    return $grants_conditions;
  }

  /**
   * Helper function. Obtains node object from either node, paragraph or paragraph comment.
   */
  protected function getNode(ComplexDataInterface $item) {
    $item = $item->getValue();

    // Get node object out of paragraph.
    if ($item instanceof ParagraphInterface) {
      $item = $item->getParentEntity();
    }

    // Get node object out of paragraph comment.
    if ($item instanceof EckEntityInterface) {
      if ($item->hasField('field_comment_paragraph')) {
        $paragraph_id = $item->get('field_comment_paragraph')->getString();
        if (!empty($paragraph_id)) {
          $paragraph = Paragraph::load($paragraph_id);
          if (empty($paragraph)) {
            return NULL;
          }
          return $paragraph->getParentEntity();
        }
      }
    }

    // Get node object out of node.
    if ($item instanceof NodeInterface) {
      return $item;
    }

    return NULL;
  }

  /**
   * Helper function. Returns data source id in search api system out of entity type.
   *
   * @param string $entity_type
   *   Entity type.
   *
   * @return int|string
   *   Source id.
   */
  private function getDataSourceIdByEntityType($entity_type) {
    foreach ($this->index->getDatasources() as $datasource_id => $datasource) {
      $datasource_entity_type = $datasource->getEntityTypeId();
      if ($entity_type == $datasource_entity_type) {
        return $datasource_id;
      }
    }
    return '';
  }

  /**
   * Returns root condition group for all content.
   *
   * Each content query (node, paragraph, etc) should attach their access queries to this condition group.
   */
  private function getOuterConditionGroup(QueryInterface $query) {

    // First try to find the condition group in the query if it is already exists.
    $conditions = $query->getConditionGroup();
    if (!empty($conditions->getConditions())) {
      foreach ($conditions->getConditions() as $condition) {
        if ($condition instanceof ConditionGroupInterface) {
          if (in_array('anu_access', $condition->getTags())) {
            $outer_condition_group = $condition;
          }
        }
      }
    }

    // If group doesn't exist, then create it.
    if (empty($outer_condition_group)) {
      $outer_condition_group = $query->createConditionGroup('OR', ['anu_access']);
      $query->addConditionGroup($outer_condition_group);
    }

    return $outer_condition_group;
  }

}
