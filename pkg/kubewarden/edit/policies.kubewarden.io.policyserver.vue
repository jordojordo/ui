<script>
import merge from 'lodash/merge';

import { _CREATE, _EDIT } from '@shell/config/query-params';
import CreateEditView from '@shell/mixins/create-edit-view';

import CruResource from '@shell/components/CruResource';
import Loading from '@shell/components/Loading';

import { DEFAULT_POLICY_SERVER } from '../models/policies.kubewarden.io.policyserver';
import { KUBEWARDEN } from '../types';

import Values from '../components/PolicyServer/Values';

export default {
  components: {
    CruResource, Loading, Values
  },

  mixins: [CreateEditView],

  props: {
    mode: {
      type:    String,
      default: _EDIT
    },

    realMode: {
      type:    String,
      default: _EDIT
    },

    value: {
      type:     Object,
      required: true
    },
  },

  async fetch() {
    const schema = this.$store.getters[`cluster/schemaFor`](KUBEWARDEN.POLICY_SERVER);

    await schema.fetchResourceFields();
  },

  data() {
    return {
      errors:           [],
      chartValues:      this.value,
      validationPassed: true,
    };
  },

  created() {
    if ( this.isCreate ) {
      merge(this.chartValues, structuredClone(DEFAULT_POLICY_SERVER));
    }
  },

  computed: {
    isCreate() {
      return this.realMode === _CREATE;
    }
  },

  methods: {
    handleValidationPassed(val) {
      this.validationPassed = val;
    },
    async finish(event) {
      // here we cleanup the securityContexts "seccompProfile" property if there are no keys set on the object
      ['pod', 'container'].forEach((type) => {
        if (this.chartValues?.spec?.securityContexts?.[type]?.seccompProfile && !Object.keys(this.chartValues?.spec?.securityContexts?.[type]?.seccompProfile).length) {
          delete this.chartValues?.spec?.securityContexts?.[type]?.seccompProfile;
        }
      });

      try {
        await this.save(event);
      } catch (e) {
        this.errors.push(e);
      }
    }
  }
};
</script>

<template>
  <Loading v-if="$fetchState.pending" mode="relative" />
  <CruResource
    v-else
    :resource="value"
    :mode="realMode"
    :can-yaml="false"
    :done-route="doneRoute"
    :errors="errors"
    :validation-passed="validationPassed"
    @finish="finish"
    @error="e => errors = e"
  >
    <Values
      :value="value"
      :chart-values="chartValues"
      :mode="mode"
      @validation-passed="handleValidationPassed"
    />
  </CruResource>
</template>
