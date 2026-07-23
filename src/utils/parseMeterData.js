export const parseMeterData = (response) => {

  const data = response.nodes[2].data;

  const indexMap = data[0];

  const meterId = data[indexMap.meterId];

  // Find where the installed meter JSON string is stored
  const detailIndex = data[indexMap.detail].classData;

  const installedMeter = JSON.parse(data[detailIndex]).installed_meter;

  const hierarchyIndexes = data[indexMap.hierarchy];

  const hierarchy = {};

  Object.entries(hierarchyIndexes).forEach(([key, value]) => {
    hierarchy[key] = data[value];
  });

  return {
    meterId,
    installedMeter,
    hierarchy,
  };;
};
