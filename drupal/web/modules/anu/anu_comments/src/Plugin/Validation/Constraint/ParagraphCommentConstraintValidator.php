<?php

namespace Drupal\anu_comments\Plugin\Validation\Constraint;

use Drupal\Component\Render\FormattableMarkup;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

/**
 * Validates the ParagraphComment constraint.
 */
class ParagraphCommentConstraintValidator extends ConstraintValidator {

  /**
   * {@inheritdoc}
   */
  public function validate($entity, Constraint $constraint) {
    if (!isset($entity)) {
      return;
    }

    // Parent ID can't have same ID as current entity.
    if (!empty($entity->id()) && !empty($entity->field_comment_parent->getValue())) {
      $parent_value = $entity->field_comment_parent->getString();

      if ($parent_value == $entity->id()) {
        $message = "Parent entity id can't be same as entity id: @id.";
        $params = ['@id' => $entity->id()];

        $this->context->buildViolation($message, $params)
          ->atPath('field_comment_parent')
          ->addViolation();

        \Drupal::logger('anu_comments')->error(new FormattableMarkup($message, $params));
      }
    }

    if (!empty($entity->field_comment_paragraph->getValue())) {
      $paragraph_id = $entity->field_comment_paragraph->getString();
      $paragraph_entity = \Drupal::entityManager()->getStorage('paragraph')->load($paragraph_id);

      // Check if referenced paragraph exists.
      if (empty($paragraph_entity)) {
        $message = "Referenced paragraph with id @id doesn't exists.";
        $params = ['@id' => $paragraph_id];

        $this->context->buildViolation($message, $params)
          ->atPath('field_comment_paragraph')
          ->addViolation();

        \Drupal::logger('anu_comments')->error(new FormattableMarkup($message, $params));
      }

      // Check if current paragraph id and parent paragraph id match.
      elseif (!empty($entity->field_comment_parent->getValue())) {
        $parent = $entity->field_comment_parent
          ->first()
          ->get('entity')
          ->getValue();

        if (!empty($parent)) {
          $parent_paragraph_id = $parent
            ->get('field_comment_paragraph')
            ->getString();

          if ($paragraph_id != $parent_paragraph_id) {
            $message = "Paragraph id @id and Parent Paragraph id @parent_id don't match.";
            $params = ['@id' => $paragraph_id, '@parent_id' => $parent_paragraph_id];

            $this->context->buildViolation($message, $params)
              ->atPath('field_comment_parent')
              ->addViolation();

            \Drupal::logger('anu_comments')->error(new FormattableMarkup($message, $params));
          }
        }
      }
    }
  }

}
