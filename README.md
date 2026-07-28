# Ports View

Web worker for the Ports panel view in Lvce Editor.

The worker renders a virtualized table of forwarded ports with active status,
port number, forwarded address, running process, and origin. Port providers can
update the view through the `Ports.setPorts` command.

## Contributing

```sh
git clone git@github.com:lvce-editor/ports-view.git &&
cd ports-view &&
npm ci &&
npm test
```
