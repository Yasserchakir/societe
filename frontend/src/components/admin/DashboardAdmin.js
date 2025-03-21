import React from 'react'; 
import styled, { keyframes } from 'styled-components';
import { FaHeart, FaShoppingCart, FaDollarSign, FaUsers, FaClock, FaChartLine, FaUserCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled Components
const DashboardContainer = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e6e9f2 100%);
  min-height: 100vh;
  color: #2d3748;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 2rem;
  font-family: 'Poppins', sans-serif;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 colonnes par ligne */
  gap: 2rem;
  margin-top: 2rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: ${fadeIn} 0.8s ease-out;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatIcon = styled.div`
  background: linear-gradient(135deg, ${props => props.color} 0%, ${props => props.color}80 100%);
  border-radius: 12px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  box-shadow: 0 4px 12px ${props => props.color}40;
  animation: ${pulse} 2s infinite;
`;

const StatTitle = styled.h3`
  font-size: 1rem;
  color: #718096;
  margin: 0;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-family: 'Poppins', sans-serif;
`;

const StatTrend = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: ${props => props.isPositive ? '#38a169' : '#e53e3e'};
  font-weight: 500;
`;

const TrendArrow = styled.span`
  font-size: 1rem;
`;

const AdminDashboard = () => {
  const stats = [
    {
      id: 1,
      title: 'Saved Products',
      value: '50.8K',
      trend: '+28.4%',
      isPositive: true,
      icon: <FaHeart />,
      color: '#ff6b6b'
    },
    {
      id: 2,
      title: 'Stock Products',
      value: '23.6K',
      trend: '-12.6%',
      isPositive: false,
      icon: <FaShoppingCart />,
      color: '#4dabf7'
    },
    {
      id: 3,
      title: 'Sales',
      value: '756',
      trend: '+3.1%',
      isPositive: true,
      icon: <FaChartLine />,
      color: '#69db7c'
    },
    {
      id: 4,
      title: 'Average Revenue',
      value: '2.3K',
      trend: '+11.3%',
      isPositive: true,
      icon: <FaDollarSign />,
      color: '#ffd43b'
    },
    {
      id: 5,
      title: 'Active Users',
      value: '15.2K',
      trend: '+8.7%',
      isPositive: true,
      icon: <FaUsers />,
      color: '#748ffc'
    },
    {
      id: 6,
      title: 'Order Processing Time',
      value: '2.1h',
      trend: '-5.2%',
      isPositive: true,
      icon: <FaClock />,
      color: '#f783ac'
    },
    {
      id: 7,
      title: 'Customer Retention Rate',
      value: '82.5%',
      trend: '+4.2%',
      isPositive: true,
      icon: <FaUserCheck />,
      color: '#20c997'
    },
  ];

  return (
    <DashboardContainer>
      <Title>Admin Dashboard</Title>
      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard 
            key={stat.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <StatHeader>
              <StatIcon color={stat.color}>{stat.icon}</StatIcon>
              <StatTitle>{stat.title}</StatTitle>
            </StatHeader>
            <StatValue>{stat.value}</StatValue>
            <StatTrend isPositive={stat.isPositive}>
              <TrendArrow>{stat.isPositive ? '▲' : '▼'}</TrendArrow>
              {stat.trend}
            </StatTrend>
          </StatCard>
        ))}
      </StatsGrid>
    </DashboardContainer>
  );
};

export default AdminDashboard;
