export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      restrictionTo: []
    },
    {
      name: 'Users',
      url: '/users',
      icon: 'fa fa-users',
      restrictionTo: [],
      children: [
        {
          name: 'Create New User',
          url: '/users/create-new-user',
          icon: 'fa fa-plus-circle',
          restrictionTo: ['translator']
        },
        {
          name: 'Males',
          url: '/users/males',
          icon: 'fa fa-mars',
          restrictionTo: ['translator']
        },
        {
          name: 'Females',
          url: '/users/females',
          icon: 'fa fa-venus',
          restrictionTo: []
        },
        {
          name: 'Preusers',
          url: '/users/preusers',
          icon: 'fa fa-user-times',
          restrictionTo: ['translator', 'manager']
        },
        {
          name: 'Devices',
          url: '/users/devices',
          icon: 'fa fa-desktop',
          restrictionTo: ['translator', 'manager']
        }
      ]
    },
    {
      name: 'Staff',
      restrictionTo: ['translator'],
      url: '/staff',
      icon: 'fa fa-id-card-o',
      children: [
        {
          name: 'Add To Staff',
          url: '/staff/add-to-staff',
          icon: 'fa fa-plus-circle',
          restrictionTo: ['translator', 'manager']
        },
        {
          name: 'Translators List',
          url: '/staff/translators-list',
          icon: 'fa fa-list-ul',
          restrictionTo: ['translator']
        },
        {
          name: 'Managers List',
          url: '/staff/managers-list',
          icon: 'fa fa-user-circle',
          restrictionTo: ['translator', 'manager']
        }
      ]
    },
    {
      name: 'Memberships',
      url: '/memberships',
      icon: 'fa fa-file-text',
      restrictionTo: ['translator'],
      children: [
        {
          name: 'Add Membership',
          url: '/memberships/add',
          icon: 'fa fa-plus-circle',
          restrictionTo: []
        },
        {
          name: 'Memberships List',
          url: '/memberships/list',
          icon: 'fa fa-list-ul',
          restrictionTo: []
        }
      ]
    },
    {
      name: 'Packages',
      url: '/packages',
      icon: 'fa fa-gift',
      restrictionTo: ['translator', 'manager'],
      children: [
        {
          name: 'Add Package',
          url: '/packages/add',
          icon: 'fa fa-plus-circle',
          restrictionTo: []
        },
        {
          name: 'Packages List',
          url: '/packages/list',
          icon: 'fa fa-list-ul',
          restrictionTo: []
        }
      ]
    },
    {
      name: 'Shop',
      url: '/shop',
      icon: 'fa fa-shopping-cart',
      restrictionTo: ['translator', 'manager'],
      children: [
        {
          name: 'Add Products',
          url: '/shop/add',
          icon: 'fa fa-plus-circle',
          restrictionTo: ['translator', 'manager']
        },
        {
          name: 'Orders',
          url: '/shop/orders',
          icon: 'fa fa-list-alt',
          restrictionTo: ['translator', 'manager']
        },
        {
          name: 'Categories',
          url: '/shop/categories',
          icon: 'fa fa-list-ul',
          restrictionTo: ['translator', 'manager']
        }
      ]
    },
    {
      name: 'Success Stories',
      url: '/success-stories',
      icon: 'fa fa-file-text-o',
      restrictionTo: ['translator', 'manager'],
      children: [
        {
          name: 'Add Story',
          url: '/success-stories/add',
          restrictionTo: ['translator', 'manager'],
          icon: 'fa fa-plus-circle'
        },
        {
          name: 'List of Stories',
          url: '/success-stories/list',
          restrictionTo: ['translator', 'manager'],
          icon: 'fa fa-list-ul'
        }
      ]
    },
    {
      name: 'Blogs',
      url: '/blog',
      icon: 'fa fa-th',
      restrictionTo: ['translator', 'manager'],
      children: [
        {
          name: 'Add Blog',
          url: '/blog/add',
          restrictionTo: ['translator', 'manager'],
          icon: 'fa fa-plus-circle'
        },
        {
          name: 'Blogs List',
          url: '/blog/list',
          restrictionTo: ['translator', 'manager'],
          icon: 'fa fa-list-ul'
        }
      ]
    },
    {
      name: 'Messages',
      url: '/messages',
      icon: 'fa fa-envelope',
      restrictionTo: []
    },
    {
      name: 'Contact Details',
      url: '/contact-details',
      icon: 'fa fa-share-square-o',
      restrictionTo: ['translator', 'manager']
    }
  ]
}
