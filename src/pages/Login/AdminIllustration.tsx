/**
 * Admin / dashboard 风格 SVG 插图
 */
const AdminIllustration: React.FC = () => (
  <svg
    viewBox="0 0 500 400"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: '100%', height: 'auto', maxWidth: 480 }}
  >
    {/* 背景装饰圆 */}
    <circle cx="250" cy="200" r="180" fill="rgba(255,255,255,0.04)" />
    <circle cx="250" cy="200" r="130" fill="rgba(255,255,255,0.04)" />
    <circle cx="250" cy="200" r="80" fill="rgba(255,255,255,0.06)" />

    {/* 主显示器 */}
    <rect
      x="140"
      y="80"
      width="220"
      height="150"
      rx="10"
      fill="#1e293b"
      stroke="rgba(255,255,255,0.12)"
      strokeWidth="1.5"
    />
    {/* 屏幕内容 — 顶部导航栏 */}
    <rect x="150" y="90" width="200" height="12" rx="3" fill="#334155" />
    <circle cx="162" cy="96" r="3" fill="#ef4444" />
    <circle cx="172" cy="96" r="3" fill="#f59e0b" />
    <circle cx="182" cy="96" r="3" fill="#22c55e" />
    {/* 侧边栏 */}
    <rect x="150" y="108" width="32" height="112" rx="3" fill="#334155" />
    {/* 主内容区 — 模拟数据卡片 */}
    <rect
      x="190"
      y="110"
      width="72"
      height="36"
      rx="4"
      fill="#3b82f6"
      opacity="0.7"
    />
    <rect
      x="270"
      y="110"
      width="72"
      height="36"
      rx="4"
      fill="#8b5cf6"
      opacity="0.7"
    />
    <rect
      x="190"
      y="154"
      width="72"
      height="36"
      rx="4"
      fill="#10b981"
      opacity="0.7"
    />
    <rect
      x="270"
      y="154"
      width="72"
      height="36"
      rx="4"
      fill="#f59e0b"
      opacity="0.7"
    />
    {/* 折线图 */}
    <rect x="190" y="196" width="152" height="24" rx="4" fill="#334155" />
    <polyline
      points="198,214 214,204 230,210 246,198 262,208 278,200 294,206 310,196 326,202 334,198"
      fill="none"
      stroke="#3b82f6"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* 第二个显示器 — 小号 */}
    <rect
      x="200"
      y="250"
      width="140"
      height="100"
      rx="8"
      fill="#1e293b"
      stroke="rgba(255,255,255,0.1)"
      strokeWidth="1"
    />
    <rect x="210" y="260" width="120" height="10" rx="2" fill="#334155" />
    {/* 柱状图 */}
    <rect
      x="216"
      y="280"
      width="14"
      height="40"
      rx="2"
      fill="#3b82f6"
      opacity="0.8"
    />
    <rect
      x="238"
      y="274"
      width="14"
      height="46"
      rx="2"
      fill="#8b5cf6"
      opacity="0.8"
    />
    <rect
      x="260"
      y="284"
      width="14"
      height="36"
      rx="2"
      fill="#10b981"
      opacity="0.8"
    />
    <rect
      x="282"
      y="278"
      width="14"
      height="42"
      rx="2"
      fill="#f59e0b"
      opacity="0.8"
    />
    <rect
      x="304"
      y="282"
      width="14"
      height="38"
      rx="2"
      fill="#ef4444"
      opacity="0.8"
    />
    {/* 底座连接线 */}
    <line
      x1="250"
      y1="350"
      x2="250"
      y2="370"
      stroke="rgba(255,255,255,0.15)"
      strokeWidth="2"
    />
    <line
      x1="210"
      y1="370"
      x2="290"
      y2="370"
      stroke="rgba(255,255,255,0.15)"
      strokeWidth="2"
    />
    <rect
      x="200"
      y="366"
      width="100"
      height="8"
      rx="4"
      fill="rgba(255,255,255,0.08)"
    />

    {/* 浮动数据元素 */}
    <g opacity="0.6">
      <rect
        x="100"
        y="130"
        width="50"
        height="16"
        rx="4"
        fill="rgba(255,255,255,0.1)"
      />
      <rect
        x="350"
        y="160"
        width="40"
        height="12"
        rx="3"
        fill="rgba(255,255,255,0.08)"
      />
      <rect
        x="90"
        y="280"
        width="45"
        height="14"
        rx="3"
        fill="rgba(255,255,255,0.08)"
      />
      <rect
        x="370"
        y="300"
        width="55"
        height="14"
        rx="3"
        fill="rgba(255,255,255,0.08)"
      />
    </g>

    {/* 用户头像装饰 */}
    <circle cx="420" cy="100" r="18" fill="rgba(255,255,255,0.08)" />
    <circle cx="420" cy="100" r="14" fill="rgba(255,255,255,0.12)" />
    <circle cx="420" cy="95" r="5" fill="rgba(255,255,255,0.15)" />
    <ellipse cx="420" cy="108" rx="8" ry="4" fill="rgba(255,255,255,0.1)" />
  </svg>
);

export default AdminIllustration;
