
import { ComponentLibrary } from '../types';

export const availableIconLibraries = {
    'mdi': 'Material Design Icons',
    'circle-flags': 'Circle Flags',
    'fa6-solid': 'FontAwesome (Solid)',
    'simple-icons': 'Simple Icons',
};

export const availableLanguages = {
    en: 'English',
    fr: 'French',
    es: 'Spanish',
    de: 'German',
    ja: 'Japanese'
};

export const betterAuthPlugins = {
    'admin': 'admin (plugin)', 'organization': 'organization (plugin)', 'username': 'username (plugin)', 
    'twoFactor': 'twoFactor (plugin)', 'bearer': 'bearer (plugin)', 'anonymous': 'anonymous (plugin)', 
    'openAPI': 'openAPI (plugin)', 'sso': 'SSO (plugin)', 'stripe': 'Stripe (plugin)', 'polar': 'Polar (plugin)', 
    'dub': 'Dub analytics (plugin)', 'expo': 'Expo (plugin)', 'email-password': 'Email & Password (config)', 
    'oauth-github': 'OAuth GitHub (config)', 'oauth-google': 'OAuth Google (config)'
};

export const componentLists: Record<ComponentLibrary, string[]> = {
    [ComponentLibrary.Shadcn]: ["Accordion", "Alert", "AlertDialog", "Avatar", "Badge", "Button", "Card", "Checkbox", "Dialog", "DropdownMenu", "Input", "Label", "Menubar", "NavigationMenu", "Popover", "Progress", "RadioGroup", "Select", "Separator", "Sheet", "Skeleton", "Slider", "Switch", "Table", "Tabs", "Textarea", "Toast", "Tooltip"],
    [ComponentLibrary.Daisy]: ["Accordion", "Alert", "Avatar", "Badge", "Button", "Card", "Carousel", "Checkbox", "Drawer", "Dropdown", "Footer", "Hero", "Indicator", "Input", "Menu", "Modal", "Navbar", "Pagination", "Progress", "Radio", "Select", "Swap", "Switch", "Table", "Tabs", "Toast", "Tooltip"],
    [ComponentLibrary.Starwind]: ["Alert", "Badge", "Button", "Card", "Dropdown", "Input", "Modal", "Navbar", "Pagination", "Tooltip"],
    [ComponentLibrary.Custom]: ["Grid", "Flex", "Link", "Accordion", "Alert", "Alert Dialog", "Avatar", "Badge", "Breadcrumb", "Button", "Card", "Carousel", "Checkbox", "Dialog", "Dropdown", "Dropzone", "Item", "Input", "Label", "Pagination", "Progress", "Radio Group", "Select", "Separator", "Sheet", "Skeleton", "Spinner", "Switch", "Table", "Tabs", "Textarea", "Tooltip", "Header", "Footer"],
    [ComponentLibrary.None]: []
};
