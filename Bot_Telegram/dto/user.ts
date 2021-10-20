

export interface user{
    jwt: string;
    usuarioDTO: usuarioDTO;
  }
  
  export interface rolDTO{
    id: number;
    nombre: string;
    fechaCreacion: Date;
    estado: boolean;
  }

  export interface usuarioDTO{
    id: number;
    nombreCompleto: string;
    cedula: string;
    passwordEncriptado: string;
    estado: boolean,
    fechaCreacion: Date;
    fechaModificacion: Date;
    rol: rolDTO;
}