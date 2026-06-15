import { history } from '@umijs/max';
import { Typography } from 'antd';

interface Props {
  value: React.ReactNode;
  path?: string;
  state?: Record<string, any>;
}

const LinkText: React.FC<Props> = ({ value, path, state }) => (
  <Typography.Text
    copyable
    style={{ color: '#1677ff', cursor: path ? 'pointer' : undefined }}
    onClick={() => path && history.push(path, state)}
  >
    {value}
  </Typography.Text>
);

export default LinkText;
