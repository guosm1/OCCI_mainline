Name:           ockb
Version:        2.0.0.0
Release:        1
Vendor:         AsiaInfo, Inc.
URL:            http://www.asiainfo.com
Packager:       AsiaInfo, Inc.<For more information, please contact your sales representative>
Summary:        OCKB service installation package.
Group:          Applications/System
License:        Copyright AsiaInfo, Inc. 2017
Source0:        %{name}-%{version}.tar.gz
BuildArch:      x86_64
%define         userpath /opt
Prefix:         %{userpath}
%define         _topdir %(echo $PWD)/rpm
%description
OCKB service installation package.

%prep
%setup -c
%install
install -d $RPM_BUILD_ROOT%{userpath}
cp -a * $RPM_BUILD_ROOT%{userpath}
exit 0
%clean
rm -rf $RPM_BUILD_ROOT
rm -rf $RPM_BUILD_DIR/%{name}-%{version}
%files
%defattr(-,root,root)
%{userpath}

%changelog
* Fri Apr 7 2017 Zhao Yi Ming <zhaoym6@asiainfo.com>
- Initial
