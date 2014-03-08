var chai = require('chai');
var should = chai.should();


var Homepage = function() {

	this.load = function() {
		browser.get('/');
	};

	this.loginButton = element(by.id('loginModalButton'));


	this.openLoginModal = function() {
		this.loginButton.click();

		this.emailInput = element(by.model('user.email'));
		this.passwordInput = element(by.model('user.password'));
		this.loginButton = element(by.id('loginButton'));
		this.setEmail = function(email) {
			this.emailInput.sendKeys(email);
		};

		this.setPassword = function(password) {
			this.passwordInput.sendKeys(password);
		};

		this.submitLoginForm = function() {
			this.loginButton.click();
		};
	};
};

describe('Visiting root', function() {

	// browser.get('/');
	var homepage = new Homepage();
	homepage.load();

	describe('and clicking a login button', function() {

		// element(by.id('login-button')).click();
		homepage.openLoginModal();
		
		it('should create a login modal and a login form', function() {
			element(by.id('login')).should.exist;
			element(by.id('loginForm')).should.exist;
		});
	});

	describe('filling out login form with incorrect information and submitting', function() {
		homepage.setEmail('wrongemail@gmail.com');
		homepage.setPassword('wrongpassword');
		homepage.submitLoginForm();
		it('should keep the login form', function() {
			homepage.emailInput.should.exist;
			homepage.passwordInput.should.exist;
			homepage.loginButton.should.exist;
		});

		it('should display an error message', function() {

		});
	});

	describe('filling out login form with correct information and submitting', function() {
		homepage.emailInput.clear();
		homepage.passwordInput.clear();
		homepage.setEmail('hara0115@gmail.com');
		homepage.setPassword('gkfkthdus1');
		homepage.submitLoginForm();

		it('should close the modal', function() {
			homepage.emailInput.should.not.exist;
			homepage.passwordInput.should.not.exist;
			homepage.loginButton.should.not.exist;
		});
	});
});