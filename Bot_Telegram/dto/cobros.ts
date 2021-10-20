
/*
export interface cobroCancelado{
    cobroGenerado: cobroGenerado;
    descripcion: string;
    fechaCreacion: Date;
    id: number;
    recibo: recibo;
}
*/
export interface cobroGenerado{
    contribuyenteServicio: contribuyenteServicio;
    estado: boolean;
    fechaCobro: Date;
    id: number;
    monto: number;
}

export interface contribuyenteServicio{
    contribuyente: contribuyente;
    id: number;
    porcentaje: string;
    servicio: servicio;
}

export interface contribuyente{
    cedula: string;
    correoElectronico: string;
    direccion: string;
    fechaNacimiento: Date;
    id: number;
    nombre: string;
    telefono: string;
}

export interface servicio{
    descripcion: string;
    estado: boolean;
    fechaRegistro: Date;
    id: number;
    propiedad: propiedad;
    tipoServicio: string;
    ultimaActualizacion: Date;
}

export interface propiedad{
    canton: string;
    direccion: string;
    distrit: string;
    id: number;
    metrosFrente: number;
    provincia: string;
    valorTerreno: string;
    zona: string;
}


export interface recibo{
    contribuyente: string;
    descripcion: string;
    fechaEmision: Date;
    id: number;
    montoCancelado: string;
}