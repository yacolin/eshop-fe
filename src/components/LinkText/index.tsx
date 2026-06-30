import { history } from '@umijs/max';
import { Typography } from 'antd';

interface Props {
  value: React.ReactNode;
  path?: string;
  state?: Record<string, any>;
  copyable?: boolean;
}

const LinkText: React.FC<Props> = ({ value, path, state, copyable = true }) => (
  <Typography.Text
    copyable={copyable}
    style={{ color: '#1677ff', cursor: path ? 'pointer' : undefined }}
    onClick={() => path && history.push(path, state)}
  >
    {value}
  </Typography.Text>
);

export default LinkText;
