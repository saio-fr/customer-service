# Customer service

### Public api

**call@fr.saio.api.customer.get.<customerId>**
```
input: null
output: customer
```
**call@fr.saio.api.customer.getAll>**
```
input: null
output: [customer]
```
**call@fr.saio.api.customer.create**
```
input: customer {
  name: String,
  maxUsers: Int
}
output: customer
```
**call@fr.saio.api.customer.update.<customerId>**
```
input: customer {
  firstname: String,
  lastname: String,
  email: Email,
  password: String(min 8) or null to not change it,
  avatar: Url,
  roles: Array("Admin", "ChatOperator", "KnowledgeOperator")
}
output: customer
```
**call@fr.saio.api.customer.delete.<customerId>**
```
input: null
output: null
```

### How to test

```
npm test
npm run test.integration
```

### How to deploy

Simply commit or pr in develop branch for staging environment, or master for production.
This will automatically build & push containers in our Kubernetes cluster.
