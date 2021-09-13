# Skills CLI back-end

Hey there! This is the v1 of an experimental service.

What if Linkedin existed as a CLI? Well, this is the back-end of such a project.
This application stores data related to users.

Users have jobs and each job contains, skills, descriptions and title.

## Local Development

This is just a typescript project.

Please use at least Node v14, but the recommended version is Node v16.50. There's a `.nvmrc`, you can run `nvm use` if you have nvm installed.

## Dependency Diagram

![Visualization of this repo](./diagram.svg)

## Getting Started

This project heavily favors <b>npm</b> over yarn.

Start by running:

```bash
npm install
```

Build the application and generate the schema(if necessary):

```bash
npm run build
```

create an .env file:

```bash
touch .env
```

Create a JWT secret and copy it in the .env file in the next step:

```bash
node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
```

Add the following lines in the .env file:

```.env
SENDGRID_API_KEY=
JWT_SECRET=secret-you-generated-at-the-previous-step
```

Start Postgres

```bash
docker-compose up -d
```

Seed the db:

```bash
npm run db:push
```

Then run the development server:

```bash
npm run dev
```

## API access

The access to the API is protected. Depending on your access, you may be an admin or a basic user.
A basic user can only interact with its own resources.

An admin can do anything(not good!!!!)

## Deployment

TBD

## Credits

Made with Love and :coffee:

Yann
