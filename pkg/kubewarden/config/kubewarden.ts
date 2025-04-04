import { rootKubewardenRoute } from '@kubewarden/utils/custom-routing';
import { POLICY_REPORTER_PRODUCT, WG_POLICY_K8S } from '@kubewarden/types';
import {
  KUBEWARDEN,
  KUBEWARDEN_MENU,
  KUBEWARDEN_PRODUCT_NAME
} from '@kubewarden/constants';
import { POLICY_SERVER_HEADERS } from './table-headers';

export function init($plugin: any, store: any) {
  const {
    product,
    basicType,
    // configureType,
    // componentForType,
    weightType,
    virtualType,
    headers
  } = $plugin.DSL(store, $plugin.name);

  const {
    POLICY_SERVER,
    // ADMISSION_POLICY,
    // CLUSTER_ADMISSION_POLICY,
    // ADMISSION_POLICY_GROUP,
    // CLUSTER_ADMISSION_POLICY_GROUP
  } = KUBEWARDEN;

  product({
    inStore:             'cluster',
    inExplorer:          true,
    icon:                'kubewarden',
    removeable:          false,
    showNamespaceFilter: true
  });

  virtualType({
    label:       store.getters['i18n/t']('kubewarden.dashboard.title'),
    icon:        'kubewarden',
    name:        KUBEWARDEN_MENU.DASHBOARD,
    namespaced:  false,
    weight:      99,
    route:       rootKubewardenRoute(),
    overview:    true
  });

  virtualType({
    label:       store.getters['i18n/t']('kubewarden.policy.title'),
    icon:        'kubewarden',
    name:        KUBEWARDEN_MENU.POLICY,
    namespaced:  false,
    weight:      97,
    route:       {
      name:   `c-cluster-${ KUBEWARDEN_PRODUCT_NAME }-${ KUBEWARDEN_MENU.POLICY }`,
      params: { product: KUBEWARDEN_PRODUCT_NAME }
    }
  });

  virtualType({
    label:      store.getters['i18n/t']('kubewarden.policyReporter.title'),
    icon:       'notifier',
    ifHaveType: WG_POLICY_K8S.POLICY_REPORT.TYPE,
    name:       POLICY_REPORTER_PRODUCT,
    namespaced: false,
    weight:     95,
    route:      {
      name:   `c-cluster-${ KUBEWARDEN_PRODUCT_NAME }-${ POLICY_REPORTER_PRODUCT }`,
      params: { product: KUBEWARDEN_PRODUCT_NAME }
    }
  });

  basicType([
    KUBEWARDEN_MENU.DASHBOARD,
    KUBEWARDEN_MENU.POLICY,
    POLICY_REPORTER_PRODUCT,
    POLICY_SERVER,
    // ADMISSION_POLICY,
    // CLUSTER_ADMISSION_POLICY,
    // ADMISSION_POLICY_GROUP,
    // CLUSTER_ADMISSION_POLICY_GROUP
  ]);

  weightType(POLICY_SERVER, 98, true);
  // weightType(CLUSTER_ADMISSION_POLICY, 97, true);
  // weightType(ADMISSION_POLICY, 96, true);
  // weightType(ADMISSION_POLICY_GROUP, 95, true);
  // weightType(CLUSTER_ADMISSION_POLICY_GROUP, 94, true);

  headers(POLICY_SERVER, POLICY_SERVER_HEADERS);
  // headers(ADMISSION_POLICY, POLICY_HEADERS);
  // headers(CLUSTER_ADMISSION_POLICY, POLICY_HEADERS);
  //
}
