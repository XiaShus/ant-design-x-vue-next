<script setup lang="tsx">
import { Typography } from 'ant-design-vue';
import { useMobile } from 'ant-design-x-vue';

defineOptions({ name: 'UseMobileBasic' });

const isMobile = useMobile();

defineRender(() => {
  return (
    <Typography.Paragraph>
      useMobile(): <Typography.Text code>{String(isMobile.value)}</Typography.Text>
      （默认查询 <Typography.Text code>(pointer: coarse)</Typography.Text>）
    </Typography.Paragraph>
  );
});
</script>
