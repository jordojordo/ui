<script>
import jsyaml from 'js-yaml';
import { _CREATE, _EDIT } from '@shell/config/query-params';
import CreateEditView from '@shell/mixins/create-edit-view';

import CruResource from '@shell/components/CruResource';
import { removeEmptyAttrs } from '@kubewarden/utils/object';
import { handleGrowl } from '@kubewarden/utils/handle-growl';

import Config from '@kubewarden/components/Policies/Config';
import Create from '@kubewarden/components/Policies/Create';

export default {
  name: 'AdmissionPolicy',

  props: {
    value: {
      type:     Object,
      required: true
    },

    mode: {
      type:    String,
      default: _EDIT
    },

    realMode: {
      type:    String,
      default: _EDIT
    }
  },

  components: {
    CruResource,
    Config,
    Create
  },

  mixins: [CreateEditView],

  provide() {
    return {
      chartType: this.value.type,
      realMode:  this.realMode
    };
  },

  computed: {
    isCreate() {
      return this.realMode === _CREATE;
    },
  },

  methods: {
    async finish(event) {
      try {
        removeEmptyAttrs(this.value);

        await this.save(event);
      } catch (e) {
        handleGrowl({
          error: e,
          store: this.$store
        });
      }
    },
    // this updates the "value" obj for CAP's
    // with the updated values that came from the "edit YAML" scenario
    updateYamlValuesFromEdit(val) {
      const parsed = jsyaml.load(val);

      removeEmptyAttrs(parsed);
      Object.assign(this.value, parsed);
    }
  }
};
</script>

<template>
  <Create v-if="isCreate" :value="value" :mode="mode" />
  <CruResource
    v-else
    :resource="value"
    :mode="realMode"
    :can-yaml="false"
    @finish="finish"
  >
    <Config
      :value="value"
      :mode="realMode"
      @updateYamlValues="updateYamlValuesFromEdit"
    />
  </CruResource>
</template>

<style lang="scss" scoped>
:deep(.cru__footer) {
  z-index: 1;
}
</style>
