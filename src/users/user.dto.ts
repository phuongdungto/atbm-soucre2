export class CreateUserDTO {
    fullname?: string
    email: string
    password: string
}

export class CreateAdminDTO {
    fullname?: string
    email: string
    password: string
    role: string
}

export class LoginDTO {
    email: string
    password: string
}
