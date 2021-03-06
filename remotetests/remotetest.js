'use strict';

var apigeetool = require('..');
var assert = require('assert');
var path = require('path');
var request = require('request');
var util = require('util');
var stream = require('stream');
var _ = require('underscore');

var config = require('./testconfig');

var REASONABLE_TIMEOUT = 120000;
var APIGEE_PROXY_NAME = 'apigee-cli-apigee-test';
var NODE_PROXY_NAME = 'apigee-cli-node-test';

var verbose = false;

describe('Remote Tests', function() {
  this.timeout(REASONABLE_TIMEOUT);

  var deployedRevision;
  var deployedUri;

  it('Deploy Apigee Proxy', function(done) {
    var opts = baseOpts();
    opts.api = APIGEE_PROXY_NAME;
    opts.directory = path.join(__dirname, '../test/fixtures/employees');

    apigeetool.deployProxy(opts, function(err, result) {
      if (verbose) {
        console.log('Deploy result = %j', result);
      }
      if (err) {
        done(err);
      } else {
        try {
          assert.equal(result.name, APIGEE_PROXY_NAME);
          assert.equal(result.environment, config.environment);
          assert.equal(result.state, 'deployed');
          assert.equal(result.uris.length, 1);
          assert(typeof result.revision === 'number');
          deployedRevision = result.revision;
          deployedUri = result.uris[0];
          done();
        } catch (e) {
          done(e);
        }
      }
    });
  });

  it('Verify deployed URI', function(done) {
    if (verbose) {
      console.log('Testing %s', deployedUri);
    }
    request(deployedUri, function(err, resp) {
      if (err) {
        done(err);
      } else {
        try {
          assert.equal(resp.statusCode, 200);
          done();
        } catch (e) {
          done(e);
        }
      }
    });
  });

  it('List Deployments by app', function(done) {
    var opts = baseOpts();
    delete opts.environment;
    opts.api = APIGEE_PROXY_NAME;
    opts.long = true;

    apigeetool.listDeployments(opts, function(err, result) {
      if (verbose) {
        console.log('List result = %j', result);
      }
      if (err) {
        done(err);
      } else {
        var deployment = _.find(result.deployments, function(d) {
          return (d.name === APIGEE_PROXY_NAME);
        });
        try {
          assert.equal(deployment.name, APIGEE_PROXY_NAME);
          assert.equal(deployment.environment, config.environment);
          assert.equal(deployment.state, 'deployed');
          assert.equal(deployment.revision, deployedRevision);
          assert.equal(deployment.uris.length, 1);
          assert.equal(deployment.uris[0], deployedUri);
          done();
        } catch (e) {
          done(e);
        }
      }
    });
  });

  it('List Deployments by environment', function(done) {
    var opts = baseOpts();

    apigeetool.listDeployments(opts, function(err, result) {
      if (verbose) {
        console.log('List result = %j', result);
      }
      if (err) {
        done(err);
      } else {
        var deployment = _.find(result.deployments, function(d) {
          return (d.name === APIGEE_PROXY_NAME);
        });
        try {
          assert.equal(deployment.name, APIGEE_PROXY_NAME);
          assert.equal(deployment.environment, config.environment);
          assert.equal(deployment.state, 'deployed');
          assert.equal(deployment.revision, deployedRevision);
          done();
        } catch (e) {
          done(e);
        }
      }
    });
  });

  it('Undeploy Apigee Proxy With Revision', function(done) {
    var opts = baseOpts();
    opts.api = APIGEE_PROXY_NAME;
    opts.revision = deployedRevision;

    apigeetool.undeploy(opts, function(err, result) {
      if (verbose) {
        console.log('Undeploy result = %j', result);
      }
      if (err) {
        done(err);
      } else {
        try {
          assert.equal(result.name, APIGEE_PROXY_NAME);
          assert.equal(result.environment, config.environment);
          assert.equal(result.state, 'undeployed');
          done();
        } catch (e) {
          done(e);
        }
      }
    });
  });

  it('Deploy Apigee Proxy with base path', function(done) {
    var opts = baseOpts();
    opts.api = APIGEE_PROXY_NAME;
    opts.directory = path.join(__dirname, '../test/fixtures/employees');
    opts['base-path'] = '/testbase';

    apigeetool.deployProxy(opts, function(err, result) {
      if (verbose) {
        console.log('Deploy result = %j', result);
      }
      if (err) {
        done(err);
      } else {
        try {
          assert.equal(result.name, APIGEE_PROXY_NAME);
          assert.equal(result.environment, config.environment);
          assert.equal(result.state, 'deployed');
          assert.equal(result.uris.length, 1);
          assert(typeof result.revision === 'number');
          deployedRevision = result.revision;
          deployedUri = result.uris[0];
          done();
        } catch (e) {
          done(e);
        }
      }
    });
  });

  it('Verify deployed URI', function(done) {
    if (verbose) {
      console.log('Testing %s', deployedUri);
    }
    request(deployedUri, function(err, resp) {
      if (err) {
        done(err);
      } else {
        try {
          assert.equal(resp.statusCode, 200);
          done();
        } catch (e) {
          done(e);
        }
      }
    });
  });

  it('Deploy Apigee Proxy with base path and run NPM remotely', function(done) {
    var opts = baseOpts();
    opts.api = APIGEE_PROXY_NAME;
    opts.directory = path.join(__dirname, '../test/fixtures/employees');
    opts['resolve-modules'] = true;
    opts['base-path'] = '/testbase';

    apigeetool.deployProxy(opts, function(err, result) {
      if (verbose) {
        console.log('Deploy result = %j', result);
      }
      if (err) {
        done(err);
      } else {
        try {
          assert.equal(result.name, APIGEE_PROXY_NAME);
          assert.equal(result.environment, config.environment);
          assert.equal(result.state, 'deployed');
          assert.equal(result.uris.length, 1);
          assert(typeof result.revision === 'number');
          deployedRevision = result.revision;
          deployedUri = result.uris[0];
          done();
        } catch (e) {
          done(e);
        }
      }
    });
  });

  it('Verify deployed URI', function(done) {
    if (verbose) {
      console.log('Testing %s', deployedUri);
    }
    request(deployedUri, function(err, resp) {
      if (err) {
        done(err);
      } else {
        try {
          assert.equal(resp.statusCode, 200);
          done();
        } catch (e) {
          done(e);
        }
      }
    });
  });

  it('Undeploy Apigee Proxy With Revision', function(done) {
    var opts = baseOpts();
    opts.api = APIGEE_PROXY_NAME;
    opts.revision = deployedRevision;

    apigeetool.undeploy(opts, function(err, result) {
      if (verbose) {
        console.log('Undeploy result = %j', result);
      }
      if (err) {
        done(err);
      } else {
        try {
          assert.equal(result.name, APIGEE_PROXY_NAME);
          assert.equal(result.environment, config.environment);
          assert.equal(result.state, 'undeployed');
          done();
        } catch (e) {
          done(e);
        }
      }
    });
  });

  it('Deploy Node.js App', function(done) {
    var opts = baseOpts();
    opts.api = NODE_PROXY_NAME;
    opts.directory = path.join(__dirname, '../test/fixtures/employeesnode');
    opts.main = 'server.js';
    opts['base-path'] = '/apigee-cli-node-test';

    apigeetool.deployNodeApp(opts, function(err, result) {
      if (verbose) {
        console.log('Deploy result = %j', result);
      }
      if (err) {
        done(err);
      } else {
        try {
          assert.equal(result.name, NODE_PROXY_NAME);
          assert.equal(result.environment, config.environment);
          assert.equal(result.state, 'deployed');
          assert.equal(result.uris.length, 1);
          assert(typeof result.revision === 'number');
          deployedRevision = result.revision;
          deployedUri = result.uris[0];
          done();
        } catch (e) {
          done(e);
        }
      }
    });
  });

  it('Verify deployed URI', function(done) {
    if (verbose) {
      console.log('Testing %s', deployedUri);
    }
    request(deployedUri, function(err, resp) {
      if (err) {
        done(err);
      } else {
        try {
          assert.equal(resp.statusCode, 200);
          done();
        } catch (e) {
          done(e);
        }
      }
    });
  });

  it('Check logs from deployed URI', function(done) {
    var opts = baseOpts();
    opts.api = NODE_PROXY_NAME;

    var logStream = new stream.PassThrough();
    logStream.setEncoding('utf8');
    opts.stream = logStream;

    apigeetool.getLogs(opts, function(err) {
      assert(!err);

      var allLogs = '';
      logStream.on('data', function(chunk) {
        allLogs += chunk;
      });
      logStream.on('end', function() {
        try {
          assert(/Listening on port/.test(allLogs));
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });

  it('Deploy Node.js App and run NPM remotely', function(done) {
    var opts = baseOpts();
    opts.api = NODE_PROXY_NAME;
    opts.directory = path.join(__dirname, '../test/fixtures/employeesnode');
    opts.main = 'server.js';
    opts['resolve-modules'] = true;
    opts['base-path'] = '/apigee-cli-node-test';

    apigeetool.deployNodeApp(opts, function(err, result) {
      if (verbose) {
        console.log('Deploy result = %j', result);
      }
      if (err) {
        done(err);
      } else {
        try {
          assert.equal(result.name, NODE_PROXY_NAME);
          assert.equal(result.environment, config.environment);
          assert.equal(result.state, 'deployed');
          assert.equal(result.uris.length, 1);
          assert(typeof result.revision === 'number');
          deployedRevision = result.revision;
          deployedUri = result.uris[0];
          done();
        } catch (e) {
          done(e);
        }
      }
    });
  });

  it('Verify deployed URI', function(done) {
    if (verbose) {
      console.log('Testing %s', deployedUri);
    }
    request(deployedUri, function(err, resp) {
      if (err) {
        done(err);
      } else {
        try {
          assert.equal(resp.statusCode, 200);
          done();
        } catch (e) {
          done(e);
        }
      }
    });
  });

  it('List Deployments by app', function(done) {
    var opts = baseOpts();
    delete opts.environment;
    opts.api = NODE_PROXY_NAME;
    opts.long = true;

    apigeetool.listDeployments(opts, function(err, result) {
      if (verbose) {
        console.log('List result = %j', result);
      }
      if (err) {
        done(err);
      } else {
        var deployment = _.find(result.deployments, function(d) {
          return (d.name === NODE_PROXY_NAME);
        });
        try {
          assert.equal(deployment.name, NODE_PROXY_NAME);
          assert.equal(deployment.environment, config.environment);
          assert.equal(deployment.state, 'deployed');
          assert.equal(deployment.revision, deployedRevision);
          assert.equal(deployment.uris.length, 1);
          assert.equal(deployment.uris[0], deployedUri);
          done();
        } catch (e) {
          done(e);
        }
      }
    });
  });

  it('Undeploy Node.js App Without Revision', function(done) {
    var opts = baseOpts();
    opts.api = NODE_PROXY_NAME;

    apigeetool.undeploy(opts, function(err, result) {
      if (verbose) {
        console.log('Undeploy result = %j', result);
      }
      if (err) {
        done(err);
      } else {
        try {
          assert.equal(result.name, NODE_PROXY_NAME);
          assert.equal(result.environment, config.environment);
          assert.equal(result.state, 'undeployed');
          assert.equal(result.revision, deployedRevision);
          done();
        } catch (e) {
          done(e);
        }
      }
    });
  });
});

function baseOpts() {
  var o = {
    organization: config.organization,
    username: config.username,
    password: config.password,
    environment: config.environment
  };
  if (config.baseuri) {
    o.baseuri = config.baseuri;
  }
  return o;
}
