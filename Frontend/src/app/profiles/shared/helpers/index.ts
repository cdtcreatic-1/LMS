export const handleSaveActualIdRole = (idRole: number) => {
  localStorage.setItem('@actualIdRole', JSON.stringify(idRole));
};
