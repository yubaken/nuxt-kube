var fs = require('fs'),
  YAML = require('yamljs');

var hostName = process.argv[2];
if (!hostName) {
  console.error('Not setting hostname in args at 1');
  process.exit(1);
}
var tlsName = process.argv[3];
if (!tlsName) {
  console.error('Not setting tlsname in args at 2');
  process.exit(1);
}

var yamlData = fs.readFileSync('./kube/feature-ingress-tmp.yaml', 'utf8');
var config = YAML.parse(yamlData);

if (!config.spec.rules || config.spec.rules.length === 0) {
  console.error('rulesが存在しません');
  process.exit(1);
} else {
  config.spec.rules = config.spec.rules.filter(rules => rules.host !== hostName);
  config.spec.tls = config.spec.tls.filter(tls => tls.secretName !== tlsName);

  // 空rulesは登録できないのでbackendデフォルトを設定
  if (config.spec.rules.length === 0) {
    console.error('rulesが存在しません');
    process.exit(1);
  }
  fs.writeFileSync("./kube/feature-ingress-tmp.yaml", YAML.stringify(config, 30));
  process.exit();
}

