import { useState } from 'react';
import { IconType } from 'react-icons';
import { FiHome, FiUser, FiHeart, FiShoppingBag, FiGrid, FiX } from 'react-icons/fi';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawer';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog"
import { ArrowDown, BadgeQuestionMarkIcon, ChevronDown, CircleQuestionMark, Scroll } from 'lucide-react';
import { Input } from '../ui/input';
interface Props {
  // navLinks?: NavLink[];
  // collections?: Collections;
  setUploadedImage: (file: File) => void;
}
interface BottomTab {
  title: string;
  header: string;
  Icon: IconType;
  id: string;
  type: string
}

const FONTS = ['Roboto', 'Arial', 'Times New Roman', 'Georgia', 'Courier New', 'Verdana'];

const COLOR_PRESETS = [
  { name: 'Black', value: '#000' },
  { name: 'White', value: '#FFF' },
  { name: 'Red', value: 'rgb(99, 99, 68)' },
  { name: 'Blue', value: '#1f1954' },
  { name: 'Green', value: '#00AA00' },
  { name: 'Yellow', value: '#808000' },
  { name: 'Orange', value: '#FFA500' },
  { name: 'Pink', value: '#FFC0CB' },
  { name: 'Purple', value: '#800080' },
  { name: 'Gray', value: '#808080' },
];

interface TextConfig {
  value: string;
  font: string;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  color: string;
  textAlign: 'left' | 'center' | 'right';
}
const bottomTabs: BottomTab[] = [
  { id: 'custom', title: "Custom", header: "Create Your Own", Icon: FiHome, type: "color" },
  { id: 'products', title: "Product", header: "Choose Product", Icon: FiGrid, type: 'product' },
  { id: 'designs', title: "Designs", header: "Choose a design", Icon: FiShoppingBag, type: 'design' },
  { id: 'text', title: "Text", header: "Text Setting", Icon: FiHeart, type: 'text' },
  { id: 'upload', title: "Upload", header: "Upload file", Icon: FiUser, type: 'file' },
  { id: 'support', title: "Support", header: "Support", Icon: FiUser, type: 'support' },
];
const Size = [
  "S ($14.75)", "M ($14.75)", "L ($14.75)", "XL ($14.75)", "XXL ($15.75)", "3XL ($16.75)", "4XL ($16.75)", "5XL ($16.75)"
]
export const BottomNavigation = ({ handleUpload, InputRef }) => {
  // const { t } = useTranslation();
  const [color, setColor] = useState(COLOR_PRESETS[0].name)
  const [size, setSize] = useState("")
  const [currentTab, setCurrentTab] = useState('');
  console.log(currentTab)
  const renderTabContent = () => {
    switch (currentTab) {
      case 'custom':
        return (
          <div className='p-2'>
            <Input onChange={handleUpload} ref={InputRef} type='file' />
            <h6>Color: {color}</h6>
            <RadioGroup defaultValue={COLOR_PRESETS?.[0].name} className='grid-cols-6 gap-4 overflow-scroll no-scrollbar'>
              {COLOR_PRESETS.map(item => (
                <RadioGroupItem
                  value={item.name}
                  id={item.name}
                  className="w-9 h-9 rounded-xl border-2 border-gray-400 "
                  style={{ backgroundColor: item.value }}
                  onClick={() => setColor(item.name)}
                />
              ))}
            </RadioGroup>
            <div className='py-4 flex justify-between items-center'>
              <span>Size</span>
              <Dialog>
                <DialogTrigger className='w-full max-w-[80px]'>
                  <BadgeQuestionMarkIcon size={16} />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <div className='w-full p-2 border-2 border-gray-300 rounded-md'>
                <Drawer>
                  <DrawerTrigger className='text-gray-500 flex justify-between items-center w-full'>
                    {size || 'Choose size'}
                    <ChevronDown />
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className="shrink-0 p-0 shadow-sm mx-2">
                      <DrawerTitle className="flex items-center justify-between p-2">
                        Choose a size
                        <DrawerClose asChild>
                          <Button variant="ghost" size="icon">
                            <FiX size={20} />
                          </Button>
                        </DrawerClose>
                      </DrawerTitle>
                    </DrawerHeader>
                    <div className='border-t'>
                      {Size.map(item => (
                        <div className='p-3 border-b'>{item}</div>
                      ))}
                    </div>
                    <DrawerFooter className='p-2'>
                      <Button className='p-6 text-lg bg-blue-500 font-bold'>
                        <Scroll size={18} />
                        Order multiple sizes
                      </Button>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          </div>
        );
      case 'products':
        return (
          <div className="p-2">
            hi
          </div>
        )
    }
  }
  console.log(currentTab)
  return (
    <div className="fixed md:relative bottom-0 no-scrollbar overflow-x-scroll z-50 w-full bg-white py-2 border-t-2 shadow-lg md:border-none md:shadow-none">
      <Drawer>
        <div className='no-scrollbar flex items-center h-full overflow-x-auto justify-around xl:flex-col xl:justify-start xl:gap-4 py-2'>
          {bottomTabs.map((tab) => (
            <DrawerTrigger key={tab.id} asChild>
              <Button
                onClick={() => setCurrentTab(tab.id)}
                variant="ghost"
                className='flex flex-col items-center justify-center'
              >
                <tab.Icon size={32} />
                <span>{tab.title}</span>
              </Button>
            </DrawerTrigger>
          ))}
        </div>

        <DrawerContent className="flex flex-col px-1">
          <DrawerHeader className="shrink-0 p-0 shadow-sm mx-2">
            <DrawerTitle className="flex items-center justify-between border-b-2 ">
              <span>{bottomTabs.find(t => t.id === currentTab)?.header}</span>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <FiX size={20} />
                </Button>
              </DrawerClose>
            </DrawerTitle>
          </DrawerHeader>
          <div>
            {renderTabContent()}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};