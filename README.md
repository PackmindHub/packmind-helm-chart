![Packmind](CoverPackmind.png)

# Helm chart for Packmind

[![CI](https://github.com/packmindhub/packmind-helm-chart/actions/workflows/ci.yaml/badge.svg?branch=main)](https://github.com/packmindhub/packmind-helm-chart/actions/workflows/ci.yaml)
[![Release](https://github.com/packmindhub/packmind-helm-chart/actions/workflows/release.yaml/badge.svg?branch=main)](https://github.com/packmindhub/packmind-helm-chart/actions/workflows/release.yaml)

This Helm chart will install [Packmind](https://packmind.com/), the collaborative platform to raise your coding standards, on your Kubernetes cluster.

## Usage

[Helm](https://helm.sh) must be installed to use the charts. Please refer to Helm's [documentation](https://helm.sh/docs) to get started.

Once Helm has been set up correctly, add the repository:

```bash
helm repo add packmind https://packmindhub.github.io/packmind-helm-chart
```

If you had already added this repo earlier, run `helm repo update` to retrieve the latest versions of the packages. You can then run `helm search repo packmind` to see the charts.

Before installing the chart, you can check the default **values** [here](https://github.com/packmind/packmind-helm-chart/blob/main/charts/packmind/values.yaml), especially about the **MongoDB 4.x** connection.

## MongoDB 6.x connection

You have 2 options to deal with MongoDB.

### 1. Use the embedded MongoDB 6.x

Setting the `app.databaseEmbedded.enabled` at `true` will run a MongoDB instance in the cluster.

```
app:
  ...
  databaseEmbedded:
    enabled: true # use an internal mongodb in the cluster
```

The `app.databaseEmbedded.enabled` at `true` will run a MongoDB instance in the cluster.

There is a section `app.databaseEmbedded.pvc` to deal with the persistent storage, enabled by default.

### 2. Use your instance MongoDB 6.x

Setting the `app.databaseEmbedded.enabled` at `false` will require you to indicate the URI of your MongoDB instance.

See the `app.databaseUri` section to set the URI.

```
app:
 ...
 databaseUri:
    value: "mongodb://mongodb:27017/packmind" # You can set the direct URI
    # secret: # Or pass it as a secret
    #   name: mongodb-secret
    #   key: mongodb-uri
```

## Access Packmind

Check the [Contributing](docs/CONTRIBUTING.md) guide to see how to use  **ingress** to connect to Packmind.

## Run the chart

To install the chart:

```bash
helm upgrade --install packmind packmind/packmind --create-namespace --namespace packmind
```

To uninstall the chart and clean-up the cluster:

```bash
helm delete packmind
kubectl delete ns packmind
```

## Go further

Look at [Contributing](docs/CONTRIBUTING.md) if you would like to update this repository.
