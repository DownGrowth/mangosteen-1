import { defineComponent, KeepAlive, onMounted, PropType, ref } from "vue";
import { MainLayout } from "../../layouts/MainLayout";
import { Icon } from "../../shared/Icon";
import { Tab, Tabs } from "../../shared/Tabs";
import { InputPad } from "./InputPad";
import s from "./ItemCreate.module.scss";
import { Tags } from "./Tags";
export const ItemCreate = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  setup: (props, context) => {
    const refKind = ref("支出");
    return () => (
      <MainLayout>
        {{
          title: () => "记一笔",
          icon: () => <Icon name="left" class={s.navIcon} />,
          default: () => (
            <>
              {/* <Tabs selected={refKind.value} onUpdateSelected={(name)=>refKind.value=name}> */}
              <div class={s.wrapper}>
                <Tabs
                  v-model:selected={refKind.value}
                  selected={refKind.value}
                  onUpdate:selected={() => console.log(1)}
                  class={s.tabs}
                >
                  <Tab name="支出">
                    <Tags kind="expenses" />
                  </Tab>
                  <Tab name="收入">
                    <Tags kind="income" />
                  </Tab>
                </Tabs>
                <div class={s.inputPad_wrapper}>
                  <InputPad />
                </div>
              </div>
            </>
          ),
        }}
      </MainLayout>
    );
  },
});
