import {
  verifyConditions,
  prepare as prepareNpm,
  publish as publishNpm,
  addChannel as addChannelNpm,
} from '@semantic-release/npm';

export async function verify(pluginConfig, context) {
  for (const config of pluginConfig.packages) {
    await verifyConditions(config, context);
  }
}

export async function prepare(pluginConfig, context) {
  for (const config of pluginConfig.packages) {
    await prepareNpm(config, context);
  }
}

export async function addChannel(pluginConfig, context) {
  for (const config of pluginConfig.packages) {
    await addChannelNpm(config, context);
  }
}

export async function publish(pluginConfig, context) {
  for (const config of pluginConfig.packages) {
    await publishNpm(config, context);
  }
}
