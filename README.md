# Swipe List

This widget gives you the ability to create a list of objects that allows gestures in order to perform Microflow actions to a list. 
Some Inbox application have a really nice ListView where users can swipe right to mark the email done or to display some buttons. 
With this widget it is possible to recreate this User interface functionality, allowing a you to use gestures on a list.

##Authors

Simon Martyr -  [email](mailto:simon.martyr@finaps.nl)   - [github](https://github.com/simonmartyr)

## Contributing

For more information on contributing to this repository visit [Github](https://github.com/Finaps/swipeList)!

For feature requests/bugs/etc please leave feedback on the Github Issues Page.

## Typical usage scenario


<img src="https://raw.githubusercontent.com/Finaps/swipeList/master/assets/overallSwipe.PNG"/>


This widget can be used on:
- Desktop 
- Tablet 
- Phone

This widget was designed with mobile in mind to work like the email app on iOS. If you wish to have an interactve list of items this widget gives you that functionality. 
 
## Features

Main features:

- Display a list of objects & attributes of your choice. 
- Ability to configure two Microflow buttons.
- Ability to configure on selection Microflow.
- Ability to configure large swipe Microflow. 
- Responsive. 
- Customizable can change swipe direction etc. 


Default list:


<img src="https://raw.githubusercontent.com/Finaps/swipeList/master/assets/listone.PNG"/>


Option buttons:


<img src="https://raw.githubusercontent.com/Finaps/swipeList/master/assets/listview2.PNG"/>


Power slide:


<img src="https://raw.githubusercontent.com/Finaps/swipeList/master/assets/StrechAction.PNG"/>




### Limitations

 - HTML/Layout is relatively static, could maybe be enhanced in the future.
 - Currently allows for only two buttons on left or right. Can be edited currently no plans to change this. 

## Description/configuration (Widget options)

Data Source 

- Main Object - The type of object that is used within the list.
- Attributes to display - A list of Attributes that you wish to display, all types allowed. The first attribute is treated as a title. 
- Data Source Microflow - The list of objects (main object) retrieved via a Microflow.
- Show labels - show the labels of the attributes within the list. Default true, toggle to false if you wish not to show the labels. The first attribute in the attribute list is always used as a title. 

Button Options

- Two buttons or one - default two buttons, however if you want only the one button you can change this to false to only show one button.
- Microflow for button one - configure the Microflow for button one, requires the main object to be an input. 
- Microflow for button two - configure the Microflow for button two, requires the main object to be an input. 
- Button one's name - The name/text to appear on the button (one).
- Button Two's name - The name/text to appear on the button (two).
- Power Slide - When swiping an object in the list over 65% in the correct direction it will kick off the Microflow bound to button one.
- Button align - Choose which side the buttons will be displayed. (Left or right) 
- On Click Microflow - When clicking/tapping an object this Microflow with fire. 


## Styling - CSS Classes & HTML build up

HTML build up:


```HTML
<div class="swipe list">
	<ul>
		<li>
			<div class="behind">
				<button guid="guid" class="btn btn-primary buttonOne"> Button Text </button>
				<button guid="guid" class="btn btn-primary buttonTwo"> Button Text </button>
			</div>
			<div class="swipeItem" guid="guid">content</div>
		</li>
	</ul>
</div>
```

Note: 
Buttons are set at default of 60px width. You can change this and the javascript should continue to function as normal. 
The CSS used is .swipe button feel free to overwrite this however you wish. 

Class List: 

- .behind - This is the main class for controlling the swipe item controls. Postion must be set to absolute for this widget to continue to work.
- .swipeItem - This is the main content of your swipe item. 
- .btn - Using the standard bootstrap, should use your default styling of btn. 
- .btn-primary - Using the standard bootstrap. Should use your default styling of btn.
- .buttonOne - class for button one.
- .buttonTwo - class for button two.
- .swipe - container class.
- .list  - container class.