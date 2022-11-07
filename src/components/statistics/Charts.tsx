import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  ref,
  watch,
} from "vue";
import { FormItem } from "../../shared/Form";
import { http } from "../../shared/Http";
import { Time } from "../../shared/time";
import { Bars } from "./Bars";
import s from "./Charts.module.scss";
import { LineChart } from "./LineChart";
import { PieChart } from "./PieChart";
const DAY = 24 * 3600 * 1000;
type Data1Item = { happen_at: string; amount: number };
type Data1 = Data1Item[];
type Data2Item = { tag_id: number; tag: Tag; amount: number };
type Data2 = Data2Item[];
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
    const kind = ref("expenses");
    const chartRef = ref("line");
    const selected = computed(() => {
      if (chartRef.value === "line") {
        return <LineChart data={betterData1.value} />;
      } else if (chartRef.value === "pie") {
        return <PieChart data={betterData2.value} />;
      } else {
        return <Bars />;
      }
    });
    const data1 = ref<Data1>([]);
    const betterData1 = computed<[string, number][]>(() => {
      if (!props.startDate || !props.endDate) {
        return [];
      }
      const diff =
        new Date(props.endDate).getTime() - new Date(props.startDate).getTime();
      const n = diff / DAY + 1;
      return Array.from({ length: n }).map((_, i) => {
        const time = new Time(props.startDate + "T00:00:00.000+0800")
          .add(i, "day")
          .getTimestamp();
        const item = data1.value[0];
        const amount =
          item && new Date(item.happen_at).getTime() === time
            ? data1.value.shift()!.amount || 0
            : 0;
        return [new Date(time).toISOString(), amount];
      });
    });
    const fetchData1 = async () => {
      const response = await http.get<{ groups: Data1; summary: number }>(
        "/items/summary",
        {
          happen_after: props.startDate,
          happen_before: props.endDate,
          kind: kind.value,
          group_by: "happen_at",
          _mock: "itemSummary",
        }
      );
      data1.value = response.data.groups;
    };
    onMounted(fetchData1);
    watch(() => [kind.value, chartRef.value], fetchData1);
    //data2
    const data2 = ref<Data2>([]);
    const betterData2 = computed<{ name: string; value: number }[]>(() =>
      data2.value.map((item) => ({
        name: item.tag.name,
        value: item.amount,
      }))
    );
    const fetchData2 = async () => {
      const response = await http.get<{ groups: Data2; summary: number }>(
        "/items/summary",
        {
          happen_after: props.startDate,
          happen_before: props.endDate,
          kind: kind.value,
          group_by: "tag_id",
          _mock: "itemSummary",
        }
      );
      data2.value = response.data.groups;
    };
    onMounted(fetchData2);
    watch(() => [kind.value, chartRef.value], fetchData2);
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
            v-model={kind.value}
          />
          <FormItem
            class={s.formItem}
            label="图表类型"
            type="select"
            options={[
              { value: "line", text: "折线图" },
              { value: "pie", text: "饼状图" },
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
