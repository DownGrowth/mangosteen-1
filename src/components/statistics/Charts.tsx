import { computed, defineComponent, PropType, ref } from "vue";
import { FormItem } from "../../shared/Form";
import { Bars } from "./Bars";
import s from "./Charts.module.scss";
import { LineChart } from "./LineChart";
import { PieChart } from "./PieChart";

export const Charts = defineComponent({
  props: {
    startDate: {
      type: String as PropType<string>,
      required: false,
    },
    endDate: {
      type: String as PropType<string>,
      required: false,
    },
  },
  setup: (props, context) => {
    const category = ref("expenses");
    const chartRef = ref("pie");
    const selected = computed(() => {
      if (chartRef.value === "line") {
        return <LineChart />;
      } else if (chartRef.value === "pie") {
        return <PieChart />;
      } else {
        return <Bars />;
      }
    });
    return () => (
      <div class={s.wrapper}>
        <div class={s.formItemWrapper}>
          <FormItem
            class={s.formItem}
            label="类型"
            type="select"
            options={[
              { value: "expenses", text: "支出" },
              { value: "income", text: "收入" },
            ]}
            v-model={category.value}
          />
          <FormItem
            class={s.formItem}
            label="图表类型"
            type="select"
            options={[
              { value: "pie", text: "饼状图" },
              { value: "line", text: "折线图" },
              { value: "bar", text: "条形图" },
            ]}
            v-model={chartRef.value}
          />
        </div>
        <div>{selected.value}</div>
      </div>
    );
  },
});
