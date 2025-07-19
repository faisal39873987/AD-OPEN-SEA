'use client'

export interface ServiceData {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  image: string
  providers: number
  rating: number
  category: string
}

interface ServiceCircleProps {
  service: ServiceData
  onClick: (service: ServiceData) => void
}

export default function ServiceCircle({ service, onClick }: ServiceCircleProps) {
  // Function to get appropriate icon and color for each service
  const getServiceIcon = (serviceId: string) => {
    const iconProps = { className: "w-8 h-8 text-white" }
    
    switch (serviceId) {
      case 'personal-trainer':
        return {
          icon: (
            <svg {...iconProps} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M21,9V7H15L13.5,7.5C13.1,7.4 12.6,7.5 12,7.5C11.4,7.5 10.9,7.4 10.5,7.5L9,7H3V9H9L10.5,9.5C10.9,9.6 11.4,9.5 12,9.5C12.6,9.5 13.1,9.6 13.5,9.5L15,9H21M7.5,12A2.5,2.5 0 0,1 10,14.5A2.5,2.5 0 0,1 7.5,17A2.5,2.5 0 0,1 5,14.5A2.5,2.5 0 0,1 7.5,12M16.5,12A2.5,2.5 0 0,1 19,14.5A2.5,2.5 0 0,1 16.5,17A2.5,2.5 0 0,1 14,14.5A2.5,2.5 0 0,1 16.5,12Z"/>
            </svg>
          ),
          color: 'bg-blue-500'
        }
      case 'home-cleaning':
        return {
          icon: (
            <svg {...iconProps} fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.36,2.72L20.78,4.14L15.06,9.85C16.13,11.39 16.28,13.24 15.38,14.44L9.06,8.12C10.26,7.22 12.11,7.37 13.65,8.44L19.36,2.72M5.93,17.57C3.92,15.56 2.69,13.16 2.35,10.92L7.23,8.83L14.67,16.27L12.58,21.15C10.34,20.81 7.94,19.58 5.93,17.57Z"/>
            </svg>
          ),
          color: 'bg-green-500'
        }
      case 'beauty-clinic':
        return {
          icon: (
            <svg {...iconProps} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,2A9,9 0 0,1 21,11C21,11.75 20.9,12.5 20.71,13.19L18.5,11C18.83,10.42 19,9.74 19,9A7,7 0 0,0 12,2A7,7 0 0,0 5,9C5,10.57 5.46,12 6.27,13.19L4.29,15.17C3.5,13.75 3,12.42 3,11A9,9 0 0,1 12,2M16,9A4,4 0 0,0 12,5A4,4 0 0,0 8,9C8,10.85 9.43,12.38 11.24,12.85L12.76,14.37C15.1,13.9 17,11.71 17,9H16M12,7A2,2 0 0,1 14,9A2,2 0 0,1 12,11A2,2 0 0,1 10,9A2,2 0 0,1 12,7M8.5,16.5L12,13L15.5,16.5L12,20L8.5,16.5Z"/>
            </svg>
          ),
          color: 'bg-pink-500'
        }
      case 'transportation':
        return {
          icon: (
            <svg {...iconProps} fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92,6.01C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.28,5.42 5.08,6.01L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6.01M6.5,6.5H17.5L19,10.5H5L6.5,6.5M7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16M16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16Z"/>
            </svg>
          ),
          color: 'bg-orange-500'
        }
      case 'property-rental':
        return {
          icon: (
            <svg {...iconProps} fill="currentColor" viewBox="0 0 24 24">
              <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
            </svg>
          ),
          color: 'bg-purple-500'
        }
      case 'pet-care':
        return {
          icon: (
            <svg {...iconProps} fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.5,13C5.89,13 7,11.89 7,10.5C7,9.11 5.89,8 4.5,8C3.11,8 2,9.11 2,10.5C2,11.89 3.11,13 4.5,13M9,13C10.39,13 11.5,11.89 11.5,10.5C11.5,9.11 10.39,8 9,8C7.61,8 6.5,9.11 6.5,10.5C6.5,11.89 7.61,13 9,13M15,13C16.39,13 17.5,11.89 17.5,10.5C17.5,9.11 16.39,8 15,8C13.61,8 12.5,9.11 12.5,10.5C12.5,11.89 13.61,13 15,13M19.5,13C20.89,13 22,11.89 22,10.5C22,9.11 20.89,8 19.5,8C18.11,8 17,9.11 17,10.5C17,11.89 18.11,13 19.5,13M17.5,18C18.33,18 19,17.33 19,16.5C19,15.67 18.33,15 17.5,15C16.67,15 16,15.67 16,16.5C16,17.33 16.67,18 17.5,18M6.5,18C7.33,18 8,17.33 8,16.5C8,15.67 7.33,15 6.5,15C5.67,15 5,15.67 5,16.5C5,17.33 5.67,18 6.5,18Z"/>
            </svg>
          ),
          color: 'bg-teal-500'
        }
      case 'baby-world':
        return {
          icon: (
            <svg {...iconProps} fill="currentColor" viewBox="0 0 24 24">
              <path d="M18,2A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2H18M18,4H6V20H18V4M8,6V8H16V6H8M8,10V12H14V10H8M8,14V16H16V14H8Z"/>
            </svg>
          ),
          color: 'bg-yellow-500'
        }
      default:
        return {
          icon: (
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {service.name.charAt(0)}
              </span>
            </div>
          ),
          color: 'bg-gray-500'
        }
    }
  }

  const { icon, color } = getServiceIcon(service.id)

  return (
    <div 
      className="flex flex-col items-center cursor-pointer group"
      onClick={() => onClick(service)}
    >
      <div className="relative w-16 h-16 mb-3">
        <div className={`w-full h-full rounded-full ${color} flex items-center justify-center group-hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
          {icon}
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">{service.providers}</span>
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors">
          {service.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1 max-w-20 line-clamp-2">
          {service.description}
        </p>
        <div className="flex items-center justify-center mt-1">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-xs text-gray-600 ml-1">{service.rating}</span>
        </div>
      </div>
    </div>
  )
}
