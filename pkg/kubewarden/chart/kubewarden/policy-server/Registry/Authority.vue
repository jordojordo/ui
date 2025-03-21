<script>
import { _EDIT, _VIEW } from '@shell/config/query-params';

import FileSelector, { createOnSelected } from '@shell/components/form/FileSelector';
import { LabeledInput } from '@components/Form/LabeledInput';

export default {
  props: {
    mode: {
      type:    String,
      default: _EDIT
    },
    value: {
      type:    Object,
      default: () => {}
    }
  },

  components: {
    FileSelector,
    LabeledInput,
  },

  data() {
    return { chartValues: this.value };
  },

  watch: {
    'chartValues.registryName': 'update',
    'chartValues.certs':        {
      deep:    true,
      handler: 'update'
    }
  },

  computed: {
    isView() {
      return this.mode === _VIEW;
    }
  },

  methods: {
    addCertificate() {
      this.chartValues.certs.push('');
    },

    handleSelectFile(event) {
      createOnSelected('crt');

      this.chartValues.certs.push(event);
    },

    removeCert(cIndex) {
      this.chartValues.certs.splice(cIndex, 1);
    },

    update() {
      this.$emit('update', this.value);
    }
  }
};
</script>

<template>
  <div class="mt-20 mb-20 sources__container">
    <div>
      <LabeledInput
        ref="authorityName"
        v-model:value="chartValues.registryName"
        data-testid="ps-config-authority-name-input"
        type="multiline"
        :label="t('kubewarden.policyServerConfig.sourceAuthorities.endpoint')"
        class="mb-20 mt-20"
        :mode="mode"
        :disabled="isView"
        :placeholder="t('kubewarden.policyServerConfig.sourceAuthorities.placeholder')"
        required
      />

      <template>
        <template v-for="(cert, cIndex) in chartValues.certs" :key="cIndex">
          <div class="sources__container__cert">
            <LabeledInput
              ref="authorityCert"
              v-model:value="chartValues.certs[cIndex]"
              :data-testid="`ps-config-authority-cert-input-${ cIndex }`"
              type="multiline"
              :label="t('kubewarden.policyServerConfig.sourceAuthorities.certificate.label')"
              class="p-10 col span-6"
              :mode="mode"
              :disabled="isView"
              required
              :placeholder="t('secret.certificate.certificatePlaceholder')"
            />

            <div class="remove">
              <button
                :data-testid="`ps-config-authority-cert-remove-button-${ cIndex }`"
                type="button"
                :disabled="isView"
                class="btn role-link remove"
                @click="removeCert(cIndex)"
              >
                {{ t('kubewarden.policyServerConfig.sourceAuthorities.certificate.remove') }}
              </button>
            </div>
          </div>
        </template>

        <button
          data-testid="ps-config-authority-cert-add-button"
          type="button"
          class="btn role-tertiary add"
          :disabled="isView"
          @click="addCertificate()"
        >
          {{ t('kubewarden.policyServerConfig.sourceAuthorities.certificate.add') }}
        </button>

        <FileSelector
          data-testid="ps-config-authority-select-file"
          class="btn role-link"
          :label="t('kubewarden.policyServerConfig.sourceAuthorities.certificate.file')"
          :disabled="isView"
          @selected="handleSelectFile($event)"
        />
      </template>
    </div>

    <slot name="remove"></slot>

    <hr class="mt-20 mb-20" />
  </div>
</template>

<style lang="scss" scoped>
.sources {
  &__container {
    position: relative;
    display: block;

    &__cert {
      display: grid;
      grid-template-columns: auto 150px;
      align-items: center;
      margin-bottom: 10px;

      & > .remove {
        text-align: right;
      }
    }

    & > .remove {
      position: absolute;

      padding: 0px;

      top: 0;
      right: 0;
    }
  }
}
</style>
