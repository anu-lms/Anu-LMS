export const getProgress = (lessons, id) => {
  const index = lessons.findIndex(element => element.id === id);
  return index !== -1 ? lessons[index].progress : 0;
};
