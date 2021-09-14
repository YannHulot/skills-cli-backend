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

You can live the SENDGRID_API_KEY below as blank for now as we won't need it.

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

## How to use the API

There is already a seeded user in the db. You can use it as it has admin privileges.
Or you can create a new one.

### Log in with seeded user

```bash
curl -v -XPOST -H "Content-type: application/json" -d '{
    "email": "steve.jobs@apple.com"
}' 'http://localhost:3000/login'
```

The response will be as follows:

```bash
{
    "emailToken": "my-email-token"
}
```

Get the JWT

```bash
curl -v -XPOST -H "Content-type: application/json" -d '{
    "email": "steve.jobs@apple.com",
    "emailToken": "my-email-token"
}' 'http://localhost:3000/authenticate'
```

The JWT should be in the <b>authorization</b> header of the response and looks like this:

```bash
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoyfQ.F46C7anVWf8RgAp6P1G1HuzNiFLolTebFzW6nPI0S4I
```

Congratulations, you now have admin powers!

Get all users:

```bash
curl -v -XGET -H 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbklkIjoyfQ.F46C7anVWf8RgAp6P1G1HuzNiFLolTebFzW6nPI0S4I' -H "Content-type: application/json" 'http://localhost:3000/users'
```

Have fun exploring the other endpoints.

## Things needed to improve the API

- Version the API
- Sanitize all the payloads/inputs
- Better error messages from the API
- Add more test coverage
- Dockerize the full application(not just Postgres)
- Refine the permissions system(for admin user and basic user)
- Create real passwordless login workflow(needs investigation)
- Add github action to deploy the application on Heroku(or Google Cloud/AWS/Azure)

Among other things...

## Deployment

TBD

## CI/CD

We are building the application and running the tests as part of the PR process.

## Credits

Made with Love and :coffee:
