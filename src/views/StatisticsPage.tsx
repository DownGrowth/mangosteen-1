import { defineComponent, PropType } from "vue";
import { Charts } from "../components/statistics/Charts";
import { TimeTabsLayout } from "../layouts/TimeTabsLayout";
export const StatisticsPage = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  setup: (props, context) => {
    return () => <TimeTabsLayout component={Charts} />;
  },
});
