# protocol_legal

The software layer for Protocol Labs internal legal tooling. Initially handling invites for the Filecoin early access program.

Security rules are currently handled on the Firestore side & not reflected here.

Deployment is a shell script to a DO droplet. Extremely improvable.

## Current #todos:

- TESTS!
- Add user details that show more data (who invited, ToS acceptance metadata, revocation, notes)
- Improve filtering and querying
- Paginate results (client side only is fine initially)

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn run serve
```

### Compiles and minifies for production

```
yarn run build
```
