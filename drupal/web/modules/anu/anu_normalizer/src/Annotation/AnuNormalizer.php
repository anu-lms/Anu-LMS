<?php

namespace Drupal\anu_normalizer\Annotation;

use Drupal\Component\Annotation\Plugin;

/**
 * Defines a AnuNormalizer plugin.
 *
 * @Annotation
 */
class AnuNormalizer extends Plugin {

  /**
   * The plugin ID.
   *
   * @var string
   */
  public $id;

  /**
   * The human-readable title.
   *
   * @var \Drupal\Core\Annotation\Translation
   *
   * @ingroup plugin_translatable
   */
  public $title;

  /**
   * The description.
   *
   * @var \Drupal\Core\Annotation\Translation
   *
   * @ingroup plugin_translatable
   */
  public $description;

}
