# protocol_legal

The software layer for Protocol Labs internal legal tooling. Initially handling invites for the Filecoin early access program.

Security rules are currently handled on the Firestore side & not reflected here.

Deployment is a shell script to a DO droplet. Extremely improvable.

## Current #todos:

- TESTS!
- Add user details that show more data (who invited, ToS acceptance metadata, revocation, notes)
- Improve filtering, searching and sorting past invites
- Paginate results (client side only is fine initially)

## Useful: how to preview FC invites

Eventually, when you add someone to the list, they'll automatically receive an invite email. This is not yet implemented. If you want to preview an invite:

- Open your console on the main invite page (`/manage-invites`)
- Add someone. The console will log their invite's ID
- Go to `/filecoin-invite/{id}` to see the invite.

[Here's](https://protocol-legal.com/filecoin-invite/fake) a fake invite page. You'll get an error message and not be able to accept, but you can read the copy.

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
