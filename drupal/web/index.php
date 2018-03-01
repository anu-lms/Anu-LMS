<?php

/**
 * @file
 * The PHP page that serves all page requests on a Drupal installation.
 *
 * All Drupal code is released under the GNU General Public License.
 * See COPYRIGHT.txt and LICENSE.txt files in the "core" directory.
 */

use Drupal\Core\DrupalKernel;
use Symfony\Component\HttpFoundation\Request;

$autoloader = require_once 'autoload.php';

$kernel = new DrupalKernel('prod', $autoloader);

$request = Request::createFromGlobals();
$response = $kernel->handle($request);
$response->send();

// TODO: REMOVE.
if ($_GET['yep']) {

  $group_id = 23;
  $course_id = 85;
  $package_folder = './sites/default/files/educare/';
  $content_folder = $package_folder . 'html5/data/js/';

  $frame_content = parseFileWithJsonData($content_folder . 'frame.js');
  $data_content = parseFileWithJsonData($content_folder . 'data.js');

  $lessons = [];

  foreach ($frame_content->notesData as $note) {
    $id = explode('.', $note->slideId)[1];
    $lessons[$id]['content'][] = [
      'type' => 'note',
      // Remove attributes from all tags.
      'value' => preg_replace("/<([a-z][a-z0-9]*)[^>]*?(\/?)>/i",'<$1$2>', $note->content),
    ];
  }

  foreach ($frame_content->navData->outline->links as $link) {
    $id = explode('.', $link->slideid)[1];
    $lessons[$id]['title'] = $link->displaytext;

    $slide_file = $content_folder . $id . '.js';
    if (file_exists($slide_file)) {
      $slide = parseFileWithJsonData($content_folder . $id . '.js');

      foreach ($slide->slideLayers[0]->objects as $object) {

        // Handle a video.
        if ($object->kind == 'video') {
          $video_asset_id = $object->data->videodata->assetId;
          $lessons[$id]['content'][] = [
            'type' => 'video',
            'value' => $data_content->assetLib[$video_asset_id]->url,
          ];
        }

        // Handle images.
        if (!empty($object->imagelib)) {
          $image_asset_id = $object->imagelib[0]->assetId;
          $lessons[$id]['content'][] = [
            'type' => 'image',
            'value' => $data_content->assetLib[$image_asset_id]->url,
          ];
        }

        // Handle text data.
        if (!empty($object->textLib) && !empty($object->data->vectorData->altText)) {
          $text = $object->data->vectorData->altText;

          // Handle a case when there are titles as text.
          if (strpos($text, '      ') > 0) {
            $titles = explode('      ', $text);
            foreach ($titles as $key => $title) {
              $title = trim($title);
              if ($title && strtoupper($lessons[$id]['title']) !== strtoupper($title)) {
                $lessons[$id]['content'][] = [
                  'type' => $key ? 'subtitle' : 'title',
                  'value' => $title,
                ];
              }
            }
          }
          // Handle another case with titles.
          elseif (strpos($text, "\\r—")) {
            $titles = explode('\\r—', $text);
            foreach ($titles as $key => $title) {
              $title = trim(str_replace('\\r', ' ', $title));
              $title = trim(str_replace('—', '', $title));
              if (!empty($title) && strtoupper($lessons[$id]['title']) !== strtoupper($title)) {
                $lessons[$id]['content'][] = [
                  'type' => $key ? 'subtitle' : 'title',
                  'value' => $title,
                ];
              }
            }
          }
          // Handle a case when text is a list items.
          elseif (strpos($text, "\\r\\r")) {
            $lessons[$id]['content'][] = [
              'type' => 'list',
              'value' => explode("\\r\\r", $text),
            ];
          }

          else {
            $text = str_replace('\\r', ' ', $text);

            // Skip text which aleady matches the title.
            if (strtoupper($lessons[$id]['title']) !== strtoupper($text)) {
              continue;
            }

            if (strtoupper($text) == $text) {

              $lessons[$id]['content'][] = [
                'type' => 'title',
                'value' => $text,
              ];
            }
            else {
              $lessons[$id]['content'][] = [
                'type' => 'text',
                'value' => $text,
              ];
            }
          }
        }
      }

      // Determine path to audio file.
      if (!empty($slide->slideLayers[0]->audiolib[0]->assetId)) {
        $audio_asset_id = $slide->slideLayers[0]->audiolib[0]->assetId;
        $lessons[$id]['content'][] = [
          'type' => 'audio',
          'value' => $data_content->assetLib[$audio_asset_id]->url,
        ];
      }
    }
  }

  $paragraph_map = [
    'title' => 'text_heading',
    'subtitle' => 'text_subheading',
    'note' => 'text_heading_text',
    'audio' => 'media_audio',
    'text' => 'text_text',
    'list' => 'list_bullet',
    'image' => 'image_centered_caption',
  ];

  foreach ($lessons as  $lesson) {

    $field_paragraph = [];

    $content = [];

    foreach ($lesson['content'] as $item) {
      if ($item['type'] == 'note') $content[] = $item;
    }

    foreach ($lesson['content'] as $item) {
      if ($item['type'] == 'title') {
        $content[] = $item;
      }
    }

    foreach ($lesson['content'] as $item) {
      if ($item['type'] == 'subtitle') {
        $content[] = $item;
      }
    }

    foreach ($lesson['content'] as $item) {
      if ($item['type'] == 'image') {
        $content[] = $item;
      }
    }

    foreach ($lesson['content'] as $item) {
      if ($item['type'] == 'text') {
        $content[] = $item;
      }
    }

    foreach ($lesson['content'] as $item) {
      if ($item['type'] == 'list') {
        $content[] = $item;
      }
    }

    foreach ($lesson['content'] as $item) {
      if ($item['type'] == 'audio') {
        $content[] = $item;
      }
    }

    foreach ($content as $item) {

      $paragraph = \Drupal\paragraphs\Entity\Paragraph::create(['type' => $paragraph_map[$item['type']]]);

      if ($item['type'] == 'title') {
        $item['value'] = strtoupper($item['value']) == $item['value'] ? ucfirst(strtolower($item['value'])) : $item['value'];
        $paragraph->set('field_paragraph_title', $item['value']);
      }
      elseif ($item['type'] == 'subtitle') {
        $paragraph->set('field_paragraph_title', $item['value']);
      }
      elseif ($item['type'] == 'note') {
        $paragraph->field_paragraph_text->value = $item['value'];
        $paragraph->field_paragraph_text->format = 'filtered_html';
      }
      elseif ($item['type'] == 'audio') {
        $content = file_get_contents($package_folder . $item['value']);
        $filename = basename($item['value']);
        // TODO: FOLDER?
        $file = file_save_data($content, 'public://' . $filename);
        $paragraph->set('field_paragraph_file', $file);
      }
      elseif ($item['type'] == 'text') {
        $paragraph->field_paragraph_text->value = $item['value'];
        $paragraph->field_paragraph_text->format = 'filtered_html';
      }
      elseif ($item['type'] == 'list') {
        foreach ($item['value'] as $value) {
          $value = trim($value);
          if ($value) {
            $paragraph->field_paragraph_list->appendItem($value);
          }
        }
      }
      elseif ($item['type'] == 'image') {
        $content = file_get_contents($package_folder . $item['value']);
        $filename = basename($item['value']);
        // TODO: FOLDER?
        $file = file_save_data($content, 'public://' . $filename);
        $paragraph->set('field_paragraph_image', $file);
      }
      else {
        continue;
      }

      $paragraph->isNew();
      $paragraph->save();

      $field_paragraph[] = [
        'target_id' => $paragraph->id(),
        'target_revision_id' => $paragraph->getRevisionId(),
      ];
    }

    $node = \Drupal\node\Entity\Node::create([
      'type' => 'lesson',
      'title' => $lesson['title'],
      'field_lesson_blocks' => $field_paragraph,
      'field_lesson_course' => $course_id
    ]);
    $node->save();

    $group = \Drupal::entityTypeManager()->getStorage('group')->load($group_id);
    $group->addContent($node, 'group_node:lesson');
  }
}

function parseFileWithJsonData($filename) {
  $content = file_get_contents($filename);
  $json_starts = strpos($content, '{');
  $json_ends = strrpos($content, '}');
  $json_content = substr($content, $json_starts, $json_ends - $json_starts + 1);
  $json_content = str_replace("\\\"", "'", $json_content);
  $json_content = str_replace("\'", "'", $json_content);
  return json_decode($json_content);
}

$kernel->terminate($request, $response);