export const parseMeterData = (response) => {
  const data = response.nodes[2].data;

  const indexMap = data[0];

  const meterId = data[indexMap.meterId];

  const detailNode = data[indexMap.detail];

  let installedMeter = {};

  // Format A (JSON string)
  if ("classData" in detailNode) {
    const detailIndex = detailNode.classData;

    installedMeter = JSON.parse(data[detailIndex]).installed_meter;
  }

  // Format B (parameter references)
  else if ("data" in detailNode) {
    const detailIndexes = data[detailNode.data];

    const detailMap = {};

    detailIndexes.forEach((index) => {
      const item = data[index];

      const key = data[item.parameterName];
      const value = data[item.parameterValue];

      detailMap[key] = value;
    });

    installedMeter = {
      MeterId: detailMap["Meter ID"],
      SerialNo: detailMap["Serial No"],
      Make: detailMap["Make"],
      PhaseType: detailMap["Phase Type"],
      InstallationStatus: detailMap["Installation Status"],
      InstallationType: detailMap["Installation Type"],
    };
  }

  const hierarchyIndexes = data[indexMap.hierarchy];

  const hierarchy = {};

  Object.entries(hierarchyIndexes).forEach(([key, value]) => {
    hierarchy[key] = data[value];
  });

  return {
    meterId,
    installedMeter,
    hierarchy,
  };
};
