<script>
import { _CREATE } from '@shell/config/query-params';
import { POD } from '@shell/config/types';

import KeyValue from '@shell/components/form/KeyValue';
import MatchExpressions from '@shell/components/form/MatchExpressions';
import InfoBox from '@shell/components/InfoBox';

export default {
  props: {
    mode: {
      type:    String,
      default: _CREATE
    },
    value: {
      type:    Object,
      default: () => {}
    }
  },

  components: {
    KeyValue,
    MatchExpressions,
    InfoBox
  },

  data() {
    const namespaceSelector = Object.assign({}, this.value) || {};
    const matchExpressions = this.value?.matchExpressions || [];
    const matchLabels = this.value?.matchLabels || {};

    return {
      POD,
      namespaceSelector,
      matchExpressions,
      matchLabels
    };
  },

  watch: {
    value: {
      deep: true,
      handler(neu) {
        this.matchExpressions = neu?.matchExpressions || [];
        this.matchLabels = neu?.matchLabels || {};
      }
    },
    matchExpressions(neu) {
      this.namespaceSelector.matchExpressions = neu;
      this.$emit('update:value', this.namespaceSelector);
    },
    matchLabels(neu) {
      this.namespaceSelector.matchLabels = neu;
      this.$emit('update:value', this.namespaceSelector);
    },
  }
};
</script>

<template>
  <div>
    <p class="col span-12 mb-20">
      {{ t('kubewarden.policyConfig.namespaceSelector.description') }}
    </p>
    <InfoBox ref="infobox">
      <div class="row mb-20">
        <div class="col span-12">
          <h4>
            <t k="kubewarden.policyConfig.namespaceSelector.matchExpressions.label" />
            <i
              v-clean-tooltip="t('kubewarden.policyConfig.namespaceSelector.matchExpressions.tooltip')"
              class="icon icon-info icon-lg"
            />
          </h4>
          <span v-clean-tooltip="t('kubewarden.policyConfig.namespaceSelector.matchExpressions.tooltip')"></span>
          <MatchExpressions
            ref="matchexp"
            v-model:value="matchExpressions"
            :mode="mode"
            :show-remove="false"
            :type="POD"
            @update:value="matchExpressions = $event"
          />
        </div>
      </div>
      <h4>
        <t k="kubewarden.policyConfig.namespaceSelector.matchLabels.label" />
        <i
          v-clean-tooltip="t('kubewarden.policyConfig.namespaceSelector.matchLabels.tooltip')"
          class="icon icon-info icon-lg"
        />
      </h4>
      <div class="row mb-20">
        <div class="col span-12">
          <KeyValue
            v-model:value="matchLabels"
            :mode="mode"
            @update:value="matchLabels = $event"
          />
        </div>
      </div>
    </InfoBox>
  </div>
</template>
