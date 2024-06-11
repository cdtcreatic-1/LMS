export class GlobalStorage {
  rol: number;

  public setRolRegister() {
    this.rol = parseInt(localStorage.getItem('@rolUser')!);
    return this.rol;
  }
}
