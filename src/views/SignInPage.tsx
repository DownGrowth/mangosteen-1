import { defineComponent, PropType, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBool } from "../hooks/useBool";
import { MainLayout } from "../layouts/MainLayout";
import { BackIcon } from "../shared/BackIcon";
import { Button } from "../shared/Button";
import { Form, FormItem } from "../shared/Form";
import { http } from "../shared/Http";
import { Icon } from "../shared/Icon";
import { hasError, validate } from "../shared/validate";
import { useMeStroe } from "../stores/useMeStore";
import s from "./SignInPage.module.scss";
export const SignInPage = defineComponent({
  setup: (props, context) => {
    const meStore = useMeStroe();
    const formData = reactive({
      email: "",
      code: "",
    });
    const errors = reactive({
      email: [],
      code: [],
    });

    const refValidationCode = ref<any>();
    const {
      ref: refDiabled,
      toggle,
      on: disabled,
      off: enable,
    } = useBool(false);
    const router = useRouter();
    const route = useRoute();
    const onError = (error: any) => {
      if (error.response.status === 422) {
        Object.assign(errors, error.response.data.errors);
      }
      throw error;
    };
    const clearError = () => {
      Object.assign(errors, {
        email: [],
        code: [],
      });
    };
    const onSubmit = async (e: Event) => {
      e.preventDefault();
      clearError();
      Object.assign(
        errors,
        validate(formData, [
          { key: "email", type: "required", message: "必填" },
          {
            key: "email",
            type: "pattern",
            regex: /.+@.+/,
            message: "必须是邮箱地址",
          },
          { key: "code", type: "required", message: "必填" },
        ])
      );
      if (!hasError(errors)) {
        const response = await http
          .post<{ jwt: string }>("/session", formData)
          .catch(onError);
        localStorage.setItem("jwt", response.data.jwt);
        // router.push("/sign_in?return_to=" + encodeURIComponent(route.fullPath));
        const returnTo = route.query.return_to?.toString();
        meStore.refreshMe();
        router.push(returnTo || "/");
        // const returnTo = localStorage.getItem("returnTo");
        // router.push(returnTo || "/");
      }
    };
    const onClickSendValidationCode = async () => {
      disabled();
      clearError();
      Object.assign(
        errors,
        validate(formData, [
          { key: "email", type: "required", message: "必填" },
          {
            key: "email",
            type: "pattern",
            regex: /.+@.+/,
            message: "必须是邮箱地址",
          },
        ])
      );
      if (hasError(errors)) {
        enable();
      } else {
        await http
          .post(
            "/validation_codes",
            { email: formData.email },
            { _autoLoading: true }
          )
          .catch(onError)
          .finally(enable);
        clearError();
        refValidationCode.value.startCount();
      }
    };
    return () => (
      <MainLayout>
        {{
          title: () => "登录",
          icon: () => <BackIcon />,
          default: () => (
            <div class={s.wrapper}>
              <div class={s.logo}>
                <Icon name="mangosteen" class={s.icon} />
                <h1 class={s.appName}>山竹记账</h1>
              </div>
              <Form onSubmit={onSubmit}>
                <FormItem
                  label="邮箱地址"
                  type="text"
                  placeholder="请输入邮箱然后发送验证码"
                  v-model={formData.email}
                  error={errors.email?.[0]}
                />
                <FormItem
                  countFrom={3}
                  disabled={refDiabled.value}
                  ref={refValidationCode}
                  label="验证码"
                  type="validationCode"
                  placeholder="请输入六位数字"
                  onClick={onClickSendValidationCode}
                  v-model={formData.code}
                  error={errors.code?.[0]}
                />
                <FormItem style={{ paddingTop: "68px" }}>
                  <Button type="submit">登录</Button>
                </FormItem>
              </Form>
            </div>
          ),
        }}
      </MainLayout>
    );
  },
});
export default SignInPage;
