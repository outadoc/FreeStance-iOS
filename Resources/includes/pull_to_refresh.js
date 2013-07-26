function tv_pull(data) {
	function formatDate() {
		var date = new Date(),
			year = date.getFullYear(),
			month = date.getMonth() + 1,
			day = date.getDate(),
			hours = date.getHours(),
			minutes = date.getMinutes();

		if(month < 10) {
			month = "0" + month;
		}
		if(day < 10) {
			day = "0" + day;
		}
		if(hours < 10) {
			hours = "0" + hours;
		}
		if(minutes < 10) {
			minutes = "0" + minutes;
		}

		var datestr = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
		return datestr;
	}

	var tableView = Ti.UI.createTableView(data),

	tableHeader = Ti.UI.createView({
		backgroundColor: '#e2e7ed',
		width: 320,
		height: 80
	}),

	border = Ti.UI.createView({
		backgroundColor: '#576c89',
		height: 1,
		bottom: 0
	}),
	
	arrow = Ti.UI.createView({
		backgroundImage: '/img/arrow.png',
		width: 23,
		height: 53,
		bottom: 15,
		left: 50
	}),

	statusLabel = Ti.UI.createLabel({
		text: I('epg.refresh.pullToRefresh'),
		left: 95,
		width: 200,
		bottom: 35,
		height: Ti.UI.SIZE,
		color: '#788193',
		textAlign: 'left',
		font: {
			fontSize: 14,
			fontWeight: 'bold'
		},
		shadowColor: '#f6f8fa',
		shadowOffset: {
			x: 0,
			y: 1
		}
	}),

	lastUpdatedLabel = Ti.UI.createLabel({
		text: I('epg.refresh.updated', formatDate()),
		left: 95,
		width: 200,
		bottom: 20,
		height: Ti.UI.SIZE,
		color: '#788193',
		textAlign: 'left',
		font: {
			fontSize: 13
		},
		shadowColor: '#f6f8fa',
		shadowOffset: {
			x: 0,
			y: 1
		}
	}),

	actInd = Ti.UI.createActivityIndicator({
		left: 50,
		bottom: 18,
		width: 30,
		height: 30,
		style: Ti.UI.iPhone.ActivityIndicatorStyle.DARK
	}),

	pulling = false,
	reloading = false;
	
	tableHeader.add(border);
	tableHeader.add(arrow);
	tableHeader.add(statusLabel);
	tableHeader.add(lastUpdatedLabel);

	tableHeader.add(actInd);
	tableView.headerPullView = tableHeader;

	function beginReloading() {
		Ti.App.fireEvent('beginreload', null);
	}

	Ti.App.addEventListener('endreload', function() {
		reloading = false;

		actInd.hide();
		arrow.show();
		tableView.setContentInsets({
			top: 0
		}, {
			animated: true
		});
	});


	tableView.addEventListener('scroll', function(e) {
		var offset = e.contentOffset.y;
		if(offset <= -70.0 && !pulling && !reloading) {
			var t = Ti.UI.create2DMatrix();
			t = t.rotate(-180);
			pulling = true;
			arrow.animate({
				transform: t,
				duration: 180
			});
			statusLabel.text = I('epg.refresh.releaseToRefresh');
		} else if((offset > -70.0 && offset < 0 ) && pulling && !reloading) {
			pulling = false;
			var t = Ti.UI.create2DMatrix();
			arrow.animate({
				transform: t,
				duration: 180
			});
			statusLabel.text = I('epg.refresh.pullToRefresh');
		}
	});

	tableView.addEventListener('dragEnd', function() {
		if(pulling && !reloading) {
			reloading = true;
			pulling = false;
			arrow.hide();
			actInd.show();
			statusLabel.setText(I('epg.refresh.loading'));

			tableView.setContentInsets({
				top: 70
			}, {
				animated: true
			});

			tableView.scrollToTop(-70, true);
			arrow.setTransform(Ti.UI.create2DMatrix());
			beginReloading();
		}
	});

	return tableView;
};

module.exports = tv_pull;
