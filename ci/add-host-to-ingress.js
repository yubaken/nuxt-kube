var fs = require('fs'),
  YAML = require('yamljs');

var hostName = process.argv[2];
if (!hostName) {
  console.error('Not setting hostname in args at 1')
  process.exit(1);
}
var tlsName = process.argv[3];
if (!tlsName) {
  console.error('Not setting tlsname in args at 2')
  process.exit(1);
}

var yamlData = fs.readFileSync('./kube/feature-ingress-tmp.yaml', 'utf8');
var config = YAML.parse(yamlData);
yamlData = fs.readFileSync('./kube/ingress-feature-conver-env.yaml', 'utf8');
var selfConfig = YAML.parse(yamlData);
var selfHostConfig = selfConfig.spec.rules[0]
var selfTLSConfig = selfConfig.spec.tls[0]

if (config.spec.rules) {
  var findHost = config.spec.rules.findIndex(rules => rules.host === hostName);
  if (findHost === -1) {
    config.spec.rules.push(selfHostConfig);
    config.spec.tls.push(selfTLSConfig);
  } else {
    config.spec.rules = config.spec.rules.map(rules => {
      if (rules.host === hostName) {
        return selfHostConfig;
      } else {
        return rules;
      }
    });

    config.spec.tls = config.spec.tls.map(tls => {
      if (tls.secretName === tlsName) {
        return selfTLSConfig;
      } else {
        return tls;
      }
    });
  }
  console.log('after:');
  console.dir(config.spec.rules, {depth: 10});
  console.dir(config.spec.tls, {depth: 10});

  fs.writeFileSync("./kube/feature-ingress-tmp.yaml", YAML.stringify(config, 30));
  process.exit();
} else {
  config.spec.rules = [];
  config.spec.tls = [];
  config.spec.rules.push(selfHostConfig);
  config.spec.tls.push(selfTLSConfig);

  fs.writeFileSync("./kube/feature-ingress-tmp.yaml", YAML.stringify(config, 30));
  process.exit();
}

