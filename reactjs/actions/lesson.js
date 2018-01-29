export function setProgress(lessonId, progress) {
  return {
    type: 'LESSON_PROGRESS_SET',
    lessonId,
    progress,
  }
}
