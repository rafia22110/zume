## 2024-03-24 - [Accessible Buttons and Focus States]
**Learning:** In a 3D-heavy interface, many interactive elements are often implemented as custom-styled divs, which breaks keyboard navigation. Converting these to semantic buttons and adding specific focus-visible rings is crucial for accessibility.
**Action:** Always prefer semantic <button> elements over <div> for clickables and include 'focus-visible:ring-2 focus-visible:ring-[#00f2fe] focus-visible:outline-none' to match this app's design system.
