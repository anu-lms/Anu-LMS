<?php

namespace Drupal\anu_paragraph\Plugin\Validation\Constraint;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

/**
 * Validates the ParagraphGDocConstraint constraint.
 */
class ParagraphGDocConstraintValidator extends ConstraintValidator {

  /**
   * {@inheritdoc}
   */
  public function validate($entity, Constraint $constraint) {
    if (!isset($entity) || $entity->bundle() != 'media_google_document') {
      return;
    }

    $url = $entity->field_paragraph_gdoc_link->getString();
    if (empty($url)) {
      return;
    }
    $url_parsed = parse_url($url);
    $path = explode('/', $url_parsed['path']);

    // Validate link to the shared google document.
    if ($url_parsed['host'] != 'docs.google.com' || $path[2] != 'd') {
      $this->context->buildViolation("Format of the shared Google Document link isn't correct.", [])
        ->atPath('field_paragraph_gdoc_link')
        ->addViolation();
    }
  }

}
