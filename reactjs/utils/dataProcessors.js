
function classData(classData) {
  return {
    uuid: classData.uuid,
    label: classData.label
  }
}

function courseData(courseData) {

  const imageUrl = courseData.entityId.fieldCourseImage ? courseData.entityId.fieldCourseImage.meta.derivatives['389x292'] : 'http://via.placeholder.com/389x292';

  return {
    uuid: courseData.entityId.uuid,
    gid: courseData.gid.uuid,
    created: courseData.entityId.created,
    title: courseData.entityId.title,
    // TODO: which URL should be used?
    url: '#',
    imageUrl: imageUrl,
    // TODO: enable image alt.
    imageAlt: courseData.entityId.title,
    // TODO: implement progress on backend.
    progressPercent: Math.floor(Math.random() * 100)
  };
}

export {
  classData,
  courseData
}