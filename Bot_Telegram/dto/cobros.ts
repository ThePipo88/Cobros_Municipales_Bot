
export interface cobroCancelado{
    cobroGenerado: cobroGenerado;
    descripcion: string;
    fechaCreacion: Date;
    id: number;
    recibo: recibo;
}

export interface cobroGenerado{
    id: number;
    contribuyenteServicio: contribuyenteServicio;
    fechaCobro: Date;
    monto: number;
    estado: boolean;
}


export interface contribuyenteServicio{
    id: number;
    porcentaje: string;
    contribuyente: contribuyente;
    servicio: servicio;
}

export interface contribuyente{
    id: number;
    cedula: string;
    nombre: string;
    fechaNacimiento: Date;
    direccion: string;
    correoElectronico: string;
    telefono: string;
}

export interface servicio{
    id: number;
    tipoServicio: string;
    descripcion: string;
    estado: boolean;
    propiedad: propiedad;
    fechaRegistro: Date;
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

