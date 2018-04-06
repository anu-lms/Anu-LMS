export function setProgress(courseId, progress) {
  return {
    type: 'COURSE_PROGRESS_SET',
    courseId,
    progress,
  };
}
