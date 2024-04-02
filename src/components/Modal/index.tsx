import { Modal, Spin, type ModalProps } from "antd";
import { useForm } from "antd/es/form/Form";
import {
  memo,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useMemo,
  useRef,
  cloneElement,
  ReactElement,
  ForwardRefRenderFunction,
} from "react";
import { createPortal, unmountComponentAtNode } from "react-dom";
import { createRoot } from "react-dom/client";

type ModalPropsCoverOnOk<T> = Omit<ModalProps, "onOk"> & {
  // 覆写 onOk 参数类型
  onOk: (values: T) => void;
};

interface FormModalConfig<T> {
  modalProps: ModalPropsCoverOnOk<T>;
  formChildren: ReactElement;
  initialValue?: Partial<T>;
}
// 对外暴露的 api
interface FormModalExposeHandler {
  open: () => void;
  close: () => void;
  setModalProps: <T>(props: ModalPropsCoverOnOk<T>) => void;
  setInitialValues: (initialValues: any) => void;
  setFormChildren: (formChildren: ReactElement) => void;
}

export type FormModalHandler = {
  open<T>(config: FormModalConfig<T>): void;
  close: () => void;
};

export const FormModal = memo(
  forwardRef((props, ref) => {
    // modal开关
    const [modalOpen, setModalOpen] = useState(false);
    // 保存注入的 prop
    const [innerProps, setInnerProps] = useState<ModalProps>({
      open: modalOpen,
      ...props,
    });
    // form 的内容
    const [formChildren, setFormChildren] = useState<ReactElement>(<></>);
    // form 实例
    const [formIns] = useForm();

    const { onOk } = innerProps;

    const onFinish = async (values: any) => {
      await onOk?.(values);
      formIns.resetFields();
      setModalOpen(false);
    };

    const handleOk = async () => {
      // 校验后触发onFinish
      try {
        await formIns.validateFields();
        formIns.submit();
      } catch (e) {}
    };

    const handleCancel = () => {
      formIns.resetFields();
      setModalOpen(false);
    };

    useImperativeHandle(ref, () => ({
      open: () => {
        setModalOpen(true);
      },
      close: () => {
        handleCancel();
      },
      setModalProps: (props: ModalProps) => {
        setInnerProps(props);
      },
      setInitialValues: (initialValues: any) => {
        formIns.setFieldsValue(initialValues);
      },
      setFormChildren: (formChildren: ReactElement) => {
        setFormChildren(formChildren);
      },
    }));
    return (
      <Modal
        {...innerProps}
        open={modalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {formChildren
          ? cloneElement(formChildren as ReactElement, {
              onFinish,
              form: formIns,
            })
          : null}
      </Modal>
    );
  }),
);

export function useFormModal() {
  const modalRef = useRef<FormModalExposeHandler>();
  const handler = useMemo(() => {
    return {
      open<T>(config: FormModalConfig<T>) {
        const { initialValue, modalProps, formChildren } = config;
        // 设置初始值
        modalRef?.current?.setInitialValues(initialValue);
        // 设置 props
        modalRef?.current?.setModalProps(modalProps);
        // 设置 form Item
        modalRef?.current?.setFormChildren(formChildren);
        // 打开 modal
        modalRef?.current?.open?.();
      },
      close: () => {
        modalRef.current?.close();
      },
    };
  }, []);
  /** 保持引用，避免重复计算 */
  const containerRef = useRef<any>(document.createDocumentFragment());
  useEffect(() => {
    const formModalContainerRef = containerRef.current;
    const modalRoot = document.createElement("div");
    document.body.appendChild(modalRoot);
    const root = createRoot(modalRoot);
    root.render(
      createPortal(
        <FormModal key="custom-modal" ref={modalRef} />,
        formModalContainerRef,
      ),
    );
    return () => {
      // 销毁时卸载
      unmountComponentAtNode(formModalContainerRef);
    };
  }, []);

  return handler;
}
