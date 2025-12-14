exports.projectHealth = (data) => {
  return {
    score: Math.max(0, 100 - Math.abs(data.variance)),
    suggestion: data.variance > 0
      ? 'Reduce cost or revise budget'
      : 'Project within control'
  };
};
