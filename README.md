# protocol_legal

[protocol-legal.com](https://protocol-legal.com)

The software layer for Protocol Labs internal legal tooling. Initially handling invites for the Filecoin early access program.

Security rules are currently handled on the Firestore side & not reflected here.

Deployment is a shell script to a DO droplet. Extremely improvable.

## Current #todos:

- TESTS!
- Add user details that show more data (who invited, ToS acceptance metadata, revocation, notes)
- Improve filtering, searching and sorting past invites
- Paginate results (client side only is fine initially)
- Make mobile friendly

## Security considerations

`protocol-legal` uses _only_ Google's Cloud Firestore as a backend. All authentication and authorization is handled by Google's access control. Every read and write request goes directly from the client to the Cloud Firestore service, where it's compared at the resource level against that user's current Google account.

Briefly, the permissions are as follows:

- Anyone with a `protocol.ai` email address can _view_ the invites that have been issued.
- A specific list of admins can _send_ invites.
- Anyone on the internet can technically _view_ an invite, but only individually given the invite's associated unique ID. The unique ID is an unguessable string with too much entropy to brute-force. The only people who can view individual invites, as a practical matter, are folks who know the string: the invitee (who received it in an email) and people inside PL.

The project **does not** handle the actual granting of GitHub access for Filecoin private preview participants, or otherwise interact with GitHub in any way. It just sends and tracks invites. GitHub permissions are intentionally handled manually after folks have gone through the invite process.

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
